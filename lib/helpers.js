'use strict';

var send           = require('send');
var mime           = send.mime;
var fs             = require('fs');
var path           = require('path');
var url            = require('url');

var WARNING        = 1;
var ERROR          = 2;
var INFO           = 3;
var NEXT           = null;

module.exports = {

    sendDocument: function (folder, htmlURI, document, isZipped, options, req, res, error) {

        var type;
        var charset;

        // If it's a compressed document update the headers
        if (isZipped) {
            type    = mime.lookup(htmlURI);
            charset = mime.charsets.lookup(type);

            res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
            res.setHeader('Content-Encoding', 'gzip');
            res.setHeader('Vary', 'Accept-Encoding');
        }

        // Send the file that was asked for
        //noinspection JSUnresolvedFunction
        send(req, document)
            .maxage(options.maxAge)
            .root(folder)                // The directory prefix send will use to find the file
            .hidden(options.hidden)      // connect-static option for completeness
            .on('error', error)          // If it fails return an error to caller with reason
            .pipe(res);
    },

    createCanonicalRoutes: function (htmlFolder, uriPath, index, ext) {

        var route = {onDisk: {plain: {}, gzip: {}}};
        route.path = uriPath;

        // Convert to canonical full uri path
        if (!uriPath || '' === uriPath || '/' === uriPath.charAt(uriPath.length-1)) {
            route.html = index;
        }
        if (route.html.lastIndexOf(ext) !== (route.html.length - ext.length)) {
            route.html = route.html + ext;
        }

        route.exists              = false;
        route.onDisk.plain.file   = path.join(htmlFolder, route.html);
        route.onDisk.plain.exists = false;

        route.onDisk.gzip.file = route.onDisk.plain.file + ".gz";
        route.onDisk.gzip.exists = false;

        return route;
    },

    fsStatWrapper : function (check, callback) {

        fs.stat(check.file, function (err, stat) {

            if (err || !stat.isFile()) {
                check.exists = false;
                check.stat   = undefined;
            } else {
                check.exists = true;
                check.stat   = stat;
            }

            callback(NEXT, check.exists);
        });
    },

    consoleLogger: function(route, issues) {
        var msg;
        var idx;

        if (issues.length) {

            console.log("connect-snapshot-static : request for fragment '" + route + "' has potential issues");

            for (idx =0 ; idx < issues.length ; idx += 1 ) {
                switch (issues[idx].level) {
                    case INFO :
                        msg = "    INFO     : ";

                    break;
                    case WARNING :
                        msg = "    WARNING  : ";

                    break;
                    case ERROR  :
                        msg = "    ERROR    : ";

                    break;
                    default :
                        msg = "    UNKNOWN :";

                    break;
                }
                console.log(msg+issues[idx].issue);
            }
        }
    },

    pushIssue : function (severity, text, issues) {

        issues.push({issue: text, level: severity});

    },

    configureSend: function (folder, uri, document, zipped, sourceUsed, out) {

        out.folder     = folder;
        out.uri        = uri;
        out.sendFile   = document.file;
        out.stat       = document.stat;
        out.zipped     = zipped;
        out.sourceUsed = sourceUsed;
    },

    collectIssues: function (out) {

        // Report potential problems with snap html files
        if (!out.snapRoutes.exists) {
            this.pushIssue(ERROR, "HTML Snapshot Route '" + out.snapRoutes.path + "' has no snapshot file " +
                                  out.snapRoutes.onDisk.plain.file + "[.gz]" +
                                  " on disk, 404 was probably issued unless source html was served",
                                  out.issues);
        } else {
            if (!out.snapRoutes.onDisk.plain.exists) {
                this.pushIssue(WARNING, "HTML Uncompressed Snap File " + out.snapRoutes.onDisk.plain.file + " is missing " +
                                        "if client rejects gzip encoding a 404 will be issued",
                                        out.issues);
            } else if (!out.snapRoutes.onDisk.gzip.exists) {
                this.pushIssue(INFO, "HTML Gzip'd Snap File " + out.snapRoutes.onDisk.gzip.file + " is missing " +
                                     "you can increase performance by pre-zipping your static files",
                                     out.issues);
            } else if (!out.allowGzip) {
                this.pushIssue(WARNING, "HTML Gzip'd Snap File " + out.snapRoutes.onDisk.gzip.file + " exists " +
                                         "but the client cannot use compressed files, this may result in a 404!",
                                         out.issues);
            }
        }

        // Report potential problem with source html files
        if (!out.htmlRoutes.exist) {
            this.pushIssue(WARNING, "HTML Source Route'" + out.htmlRoutes.path + "' has no source file " +
                                     out.htmlRoutes.onDisk.plain.file + "[.gz] on disk. " +
                                     "Possible orphaned route? Check for sitemap and dead link problems" +
                                     " the bot should not be crawling this link!",
                                     out.issues);
        } else if ( out.sourceUsed ){

                this.pushIssue(WARNING, "HTML Source File " + out.htmlRoutes.onDisk.plain.file + "[.gz] was sent " +
                                        "instead of missing Snapshot file " + out.snapRoutes.onDisk.plain.file +
                                        "[.gz] bot will probably not index this " +
                                        "route correctly!",
                                        out.issues);
            if (!out.htmlRoutes.onDisk.plain.exists) {
                this.pushIssue(WARNING, "HTML Uncompressed Source File " + out.htmlRoutes.onDisk.plain.file + " is missing " +
                                        "if client rejects gzip encoding a 404 will be issued",
                                        out.issues);
            }
            if (!out.htmlRoutes.onDisk.gzip.exists) {
                this.pushIssue(INFO, "HTML Gzip'd Source File " + out.htmlRoutes.onDisk.gzip.file + " is missing " +
                                     "you can increase performance by pre-zipping your static snapshot files",
                                     out.issues);
            }
        }

        // Make sure the source is older or equal to the snapshot else create an issue
        if (out.htmlRoutes.exists && out.snapRoutes.exists) {
            var sourceStat = out.htmlRoutes.onDisk.plain.exists ? out.htmlRoutes.onDisk.plain.stat.mtime : out.htmlRoutes.onDisk.gzip.stat.mtime;
            var snapStat = out.snapRoutes.onDisk.plain.exists ? out.snapRoutes.onDisk.plain.stat.mtime : out.snapRoutes.onDisk.gzip.stat.mtime;

            if (sourceStat.getTime() > snapStat.getTime()) {
                this.pushIssue(WARNING, "The source file for the route " + out.htmlRoutes.onDisk.plain.file + " is newer " +
                                        "than the snapshot, suggest you regenerate snapshots!",
                                         out.issues);
            }
        }

    },

    throwOnMissingFolders: function (htmlFolder, snapFolder) {
        // No this (blocking call) is not a mistake, we make sure the root and snap exist when we create
        // the module in order to avoid out of sequence failures --- this should be ok because the server
        // should not start listening until all the middleware startup processing is complete anyway

        fs.stat(htmlFolder, function (err, stat) {
            if (err || !stat.isDirectory()) {
                throw("htmlFolder " + htmlFolder + " is not a directory");
            }
        });

        fs.stat(snapFolder, function (err, stat) {
            if (err || !stat.isDirectory()) {
                throw("snapFolder " + snapFolder + " is not a directory");
            }
        });

    },

    setDefaultOptions: function (options) {
        // set connect-fragment default options if not set by user
        options                 = options                 || {};
        options.ext             = options.ext             || '.html';                 // If the route has no extension use this one
        options.index           = options.index           || 'index' + options.ext;   // If a route ends in / canonical says create default (index.html)
        options.routeMissingErr = options.routeMissingErr || 410;                     // Missing and we don't have a route, bot has bad crawl data!
        options.log             = options.log             || false;                   // Should we gather issues, only turn on for debugging
        options.sendSource      = options.sendSource      || false;                   // As a last resort send the source html vs. the snapshot
        options.logger          = options.logger          || this.consoleLogger;      // Our default internal console logger
        options.snapResolver    = options.snapResolver    || null;                    // Custom snapshot path/file resolver ( default duplicates source path/files )
        options.hidden          = options.hidden          || false;                   // Process files even if they are hidden
        options.maxAge          = options.maxAge          || 0;                       // How long should browser cache live even if file didn't change
    }
};

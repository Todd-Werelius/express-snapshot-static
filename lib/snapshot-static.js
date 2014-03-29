'use strict';

var async          = require('async');
var helper         = require('./helpers'); // tightly coupled (one off's) messy helpers
var NEXT           = null;
var HANDLED        = 1;

module.exports = function(htmlFolder, snapFolder, options) {

    // We can't work if the directories don't exist so throw an error during setup ( blocks )
    helper.throwOnMissingFolders(htmlFolder, snapFolder);

    // Set any defaults that user did not include in options
    options = options  || {};
    helper.setDefaultOptions(options);

    /**
     * Main module that looks for and serves pre-rendered html snapshots for SPA applications that bot's can't
     * properly crawl on their own -- see readme for details
     */
    return function fragment(req, res, next) {

        // Custom Error Handler for send(... failures
        function error(err) {
            res.statusCode = err.status || 500;
            res.end(err.message);
        }

        // This is not a bot request pass to next() middleware
        //noinspection JSUnresolvedVariable
        if ( ( undefined === req.query._escaped_fragment_    ) ||
             ( 'GET' !== req.method && 'HEAD' !== req.method )) {
            return next();
        }

        // Simplify the callback stack by using the async library
        async.waterfall([

                // Create routes for source html and snapshots, creates fully qualified URI's and onDisk file names
                function( callback ) {

                    var out        = {issues:[]};
                    //noinspection JSUnresolvedVariable
                    out.htmlRoutes = helper.createCanonicalRoutes(htmlFolder,req._parsedUrl.pathname,options.index,options.ext);
                    //noinspection JSUnresolvedVariable
                    out.snapRoutes = helper.createCanonicalRoutes(snapFolder,req._parsedUrl.pathname,options.index,options.ext);
                    out.allowGzip  = req.headers['accept-encoding'] && (req.headers['accept-encoding'].indexOf('gzip') > -1);

                    callback(NEXT,out);
                },

                // Get information about potential files that we can send by seeing which ones exist and store
                // their stats for later use
                function( out, callback ) {
                    async.map( [ out.htmlRoutes.onDisk.plain,   // Files we need to know about
                                 out.htmlRoutes.onDisk.gzip,
                                 out.snapRoutes.onDisk.plain,
                                 out.snapRoutes.onDisk.gzip  ],

                                 helper.fsStatWrapper,         // provides stat info for each file in array

                        //noinspection JSUnresolvedParameter
                        function() {
                            callback(NEXT, out);
                        }
                    );
                },

                // Figure out which file to send ( if any )
                function(out, callback) {
                    // Simple helper property to determine if the routes exist in any form
                    if ( out.snapRoutes.onDisk.gzip.exists || out.snapRoutes.onDisk.plain.exists ) {
                        out.snapRoutes.exist = true;
                    }
                    if ( out.htmlRoutes.onDisk.gzip.exists || out.htmlRoutes.onDisk.plain.exists ) {
                        out.htmlRoutes.exist = true;
                    }


                    // We always prefer to send gzip snapshot file if it exists and if it's allowed by caller
                    if (options.allowGzip && out.snapRoutes.onDisk.gzip.exists) {

                        helper.configureSend(snapFolder,out.snapRoutes.html,out.snapRoutes.onDisk.gzip,true,false,out);

                    // Next best is to use uncompressed snapshot file
                    } else if (out.snapRoutes.onDisk.plain.exists) {

                        helper.configureSend(snapFolder,out.snapRoutes.html,out.snapRoutes.onDisk.plain,false,false,out);

                    // We don't recommend this but you can send the source (if it exists) instead of the snapshot
                    // if options.sendSource is set to true
                    } else if ( out.sendSource && out.htmlRoutes.exist) {

                        if (out.allowGzip && out.htmlRoutes.onDisk.gzip) {

                            helper.configureSend(htmlFolder,out.htmlRoutes.html,out.htmlRoutes.onDisk.plain,true,false,out);

                        } else if (out.htmlRoutes.onDisk.plain.exists) {

                            helper.configureSend(htmlFolder,out.htmlRoutes.html,out.htmlRoutes.onDisk.plain,false,false,out);
                        }
                    }

                    // If we have something to send do so now
                    if ( out.sendFile ) {
                        helper.sendDocument(out.folder, out.uri, out.sendFile, out.zipped, options, req, res, error);
                    }

                    // DONE!
                    callback(HANDLED,out);

                }
            ],

            // Done, we either sent a file or need to send an error
            function(err,out) {
                // We didn't send a snapshot or source html file
                if (!out.sendFile) {
                    // We didn't send anything so send an error msg to caller
                    // The snapshot did not get sent but the route is ok so send a 404
                    if (out.htmlRoutes.exist) {
                        res.statusCode = 404;
                        res.end(res.statusCode + " | GET | " +
                                                 '_escaped_fragment_=' + out.snapRoutes.path + " | " +
                                                 "source route file is ok but snapshot file'" +
                                                 out.snapRoutes.onDisk.plain.file + "[.gz]' is missing");

                    // The route is bad ( no source html fragment exists )
                    } else {
                        res.statusCode = options.routeMissingErr;
                        res.end(res.statusCode + " | GET | " +
                                                 "_escaped_fragment_='" + out.snapRoutes.path + "' | " +
                                                 "' source route files '"+out.htmlRoutes.onDisk.plain.file +
                                                 "[.gz]' are missing and no snapshot was found, dead links, or bad sitemap?");
                    }
                }

                // Call the logging function to report any issues if user requested logging
                if ( options.log ) {
                    helper.collectIssues(out,options);
                    options.logger(out.snapRoutes.path,out.issues);
                }

            }
        );
    };
};
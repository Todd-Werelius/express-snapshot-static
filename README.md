[![Build Status](https://secure.travis-ci.org/Todd-Werelius/express-snapshot-static.png)](http://travis-ci.org/Todd-Werelius/express-snapshot-static)
[![Coverage Status](https://coveralls.io/repos/Todd-Werelius/express-snapshot-static/badge.png)](https://coveralls.io/r/Todd-Werelius/express-snapshot-static)
[![Dependency Status](https://gemnasium.com/Todd-Werelius/express-snapshot-static.svg)](https://gemnasium.com/Todd-Werelius/express-snapshot-static)
[![NPM version](https://badge.fury.io/gh/todd-werelius%2Fexpress-snapshot-static.png)](http://badge.fury.io/js/express-snapshot-static)

# express-snapshot-static

Middleware for connect and express.  Serves pre-built snapshots to the google bot if the
_escaped_fragment_ property is found in the request query, this is useful if you are building single page apps with MV*
frameworks such as AngularJS etc.  This module does NOT construct the snapshots, it just serves them. 

## Installation

	  $ npm install express-snapshot-static

## Tutorial
See my [AngularJS SEO Explained](http://mofodv.com/anfularjs-seo) blog post if you need more information


## Usage

### Setup
```javascript
var botHandler   = require('express-snapshot-static');     
var sourceFolder = __dirname;                          // root path you normally serve html from
var snapFolder   = path.join(__dirname,'snapshots'));  // root path you want to serve snapshots fromt
var options      = { }
```

### Connect usage
```javascript
connect().use(botHandler(sourceFolder,snapFolder,options);
```

### Express usage
```javascript
var app = express();

app.use(botHandler(htmlFolder,snapFolder,options));

```

## Options

A number of options allow you to configure how express-static snapshot works.  For the most part you can just use the default options by not passing anything to the function. See examples of custom snapResolver and logger below

```javascript
    var options = {
    
       sendSource      : false;                // As a last resort send the source html vs. the snapshot, if issue 
                                               // tracking is on this will be reported 
       snapResolver    : null;                 // Custom snapshot path/file resolver ( default duplicates source
                                               // path/filename ) user may supply own resolver to customize name lookup 
       
       ext             : '.html',              // If the route does not end in / and has no extension then 
                                               // canonical behavior is append a 'typical' extension 
       index           : 'index' + this.ext,   // If a route ends in / canonical behavior si to  append a filename, 
                                               // typcially ( index.html )
       
       routeMissingErr : 404,                  // If the snapshot is missing we just report 404, but if source html 
                                               // also missing we don't have a route so report 404 as well  
                                               // but alternatively you could report 410 that would tell bot not 
                                               // to try again
       
       logger          : this.consoleLogger,   // Our default internal console logger to report request issues 
       					       // can be replaced with users own custom logger function
       log             : false,                // If set to true code will store issues like missing source roots
                                               // uncompressed snapshots etc. and output any issues to the logger, 
                                               // you should only use to debug! 
       
       hidden          : false,                // Process files even if they are hidden ( connect send option )
       maxAge          : 0,                    // How long should browser cache live even if file didn't change	
    }	
```

###Custom snapResolver 
The default snapResolver is repsonsible for 'finding' snapshots based on the source route. Typcially servers will resolve http://mysite.com/about resolves to something like /public/about.html 

When a snapshot is requested the snapResolver takes that path and file names and replaces /public (or whatever your root source folder is) and replaces it with the snapFolder your provided when you added the express-snapshot-static middleware into your application. 

####Default behavior

Route				Server				Snapshot
http://mysite.com/about		/public/about.html		/snapshots/about.html	
http://mysite.com/user/profile	/public/user/profile.html	/snapshots/user/about.html

If instead you wanted a flat directory stucture with mappings for your routes like this example 

Route				Server				Snapsho
http://mysite.com/user/profile	/public/user/profile.html	/snapshots/snapshot_user-about.html

A snapResolver simply provides the name mapping and is fairly simple to implement, using our example it would look something like this

```javascript


```

## License 

(The MIT License)

Copyright (c) 2014 Todd Werelius contact &lt;todd.werelius@mopholo.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



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
var sourceFolder = __dirname;                             // root path you normally serve html from
var snapFolder   = path.join(__dirname + '/snapshots'));  // root path where your snapshots are stored
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

A number of options allow you to configure how express-static snapshot works.  For the most part you can just use the default options by not passing anything to the function.

```javascript
    var options = {
       ext             : '.html',              // If the route has no file extension append this
       index           : 'index' + this.ext,   // If a route ends in / canonical says create default (index.html)
       routeMissingErr : 404,                  // If source html is Missing we don't have a route, 
                                               // alternatively using 410 will tell bot not to try again
       logger          : this.consoleLogger;   // Our default internal console logger to report request issues                                         		       // can be replaced with users own custom logger function
       log             : false,                // If set to true code will store issues like missing source roots
                                               // uncompressed snapshots etc. only use to debug! 
       sendSource      : false;                // As a last resort send the source html vs. the snapshot, if issue 
                                               // tracking is on this will be reported 
       
       snapResolver    : null;                  // Custom snapshot path/file resolver ( default duplicates source
                                                // path/filename ) user may supply own resolver to create flat 
                                                // directory snapshots etc.
       hidden          : false;                 // Process files even if they are hidden ( connect send option )
       maxAge          : 0;                     // How long should browser cache live even if file didn't change	
    }	
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



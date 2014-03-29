[![Build Status](https://secure.travis-ci.org/Todd-Werelius/connect-fragment.png)](http://travis-ci.org/Todd-Werelius/express-snapshot-static)
[![Dependency Status](https://gemnasium.com/Todd-Werelius/connect-fragment.png)](https://gemnasium.com/Todd-Werelius/express-snapshot-static)
[![NPM version](https://badge.fury.io/js/connect-fragment.png)](http://badge.fury.io/js/express-snapshot-static)

# express-snapshot-static

Middleware for connect and express.  Serves pre-built snapshots to the google bot if the
_escaped_fragment_ is found in the request query, this is useful if you are building single page apps with MV*
frameworks such as AngularJS etc.  This module does NOT construct the snapshots, it just serves them. 

## Installation

	  $ npm install express-snapshot-static

## Purpose

A middleware drop in that serves existing 'snapshots' via your expressjs or connectjs node.app when a search bot makes a fragment request instead of the unrendered source html file

MORE...

If you are writing a SPA ( Single Page Application ) based on a MV* framework such as angularJS then search bot's, such as google-bot or bing-bot, will not index your pages properly since the javascript in your pages never runs and renderes the page properly. 

One way to deal with this is to pre-generate 'snapshots' of your fully rendered SPA partials/pages and either use the /#!/ routing syntax ex: http://mysite.com/#!/about, or include a <meta name="fragment" content="!"> ( use this exact  meta statemebt for all of your spa pages/partials )  

Either of the above will result in the bot issuing a get with the _escaped_fragment_ query_ parameter set to your route for the page the bot want's to crawl ex: _escaped_fragment_ query=/about 


## Options

```javascript
    var options = {
    	
    }	
```

## Usage

```javascript
var botHandler   = require('express-snapshot-static');
var sourceFolder = __dirname;
var snapFolder   = path.join(__dirname + '/snapshots'));
var options      = {
        ...
}

// Connect usage
connect().use(botHandler(sourceFolder,snapFolder,options);

// Express usage
var app = express();

// Should be the first middleware handler for GET's in the stack
app.use(botHandler(htmlFolder,snapFolder,options));

```

## License 

(The MIT License)

Copyright (c) 2014 Todd Werelius &lt;todd.werelius@mopholo.com&gt;

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



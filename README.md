[![Build Status](https://secure.travis-ci.org/Todd-Werelius/connect-fragment.png)](http://travis-ci.org/Todd-Werelius/express-snapshot-static)
[![Dependency Status](https://gemnasium.com/Todd-Werelius/connect-fragment.png)](https://gemnasium.com/Todd-Werelius/express-snapshot-static)
[![NPM version](https://badge.fury.io/js/connect-fragment.png)](http://badge.fury.io/js/express-snapshot-static)

# express-static-fragment

Middleware for connect and express.  Serves pre-built snapshots to the google bot if the
_escaped_fragment_ is found in the request query, this is useful if you are building single page apps with MV*
frameworks such as AngularJS etc.  This module does NOT construct the snapshots, it just serves them. 

## Installation

	  $ npm install express-snapshot-static

## Options
```javascript
    var options = {
    	
    }	
```

## Usage

connect-fragment(file,options)


```javascript
var botHandler = require('snapshot-static');
var htmlFolder = __dirname;
var snapFolder = path.join(__dirname + '/snapshots'));
var options    = {
        ...
}

// Connect usage
connect().use(botHandler(htmlFolder,snapFolder,options);

// Express usage
var app = express();


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



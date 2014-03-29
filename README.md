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

# License

MIT



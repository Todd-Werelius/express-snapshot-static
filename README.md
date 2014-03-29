[![Build Status](https://secure.travis-ci.org/Todd-Werelius/connect-fragment.png)](http://travis-ci.org/Todd-Werelius/fragment-static)
[![Dependency Status](https://gemnasium.com/Todd-Werelius/connect-fragment.png)](https://gemnasium.com/Todd-Werelius/fragment-static)
[![NPM version](https://badge.fury.io/js/connect-fragment.png)](http://badge.fury.io/js/connect-fragment)

# connect-fragment

Middleware for [connect][]: express.  Serves pre-built snapshots to the google bot if it finds
_escaped_fragment_ in the request query, this is useful if you are building single page apps with MV*
frameworks such as AngularJS etc.

## Installation

	  $ npm install connect-fragment

## Options
    zip       : number    0 = don't look for zipped file
                          1 = look for zipped file by adding ext (default .gz) and fail if not found
                          2 = look for zipped file by adding ext (default .gz) look for uncompressed if not found
    zExt      : string    zip extension ( Default gz)


## Usage

connect-fragment(file,options)


```javascript
var botHandler = require('connect-fragment');
var file       = path.join(__dirname + '/snapshot'));
var options    = {
        zip  :   2,  // Look for zip first, then non-compressed
        ext  : 'gz'  // append .gz to name 'gz' is the default so this is not nessecary unless you use something else
}

// Direct connect usage
connect().use(botHandler(file,options);

// Express usage
var app = express();
.
.
.
app.use(botHandler(file,options));

```

# License

MIT

[connect]: http://www.senchalabs.org/connect
[connect static]: http://www.senchalabs.org/connect/static.html

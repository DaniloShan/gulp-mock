var gulp = require('gulp'),
    gutil = require('gulp-util'),
    through = require('through2'),
    fs = require('fs');

var compile = require('./compile.js');
var opt = {};


function mock() {

    return through.obj(function (file, enc, cb) {
        var template = JSON.parse(file.contents.toString());

        file.contents = new Buffer(JSON.stringify(compile(template)));

        cb(null, file);
    });
}

mock.config = function (o) {
    opt = o || {
        apiPath: '',
        dirName: ''
    };
}

mock.middleware = function (connect) {
    return connect()
        .use(connect.query())
        .use(function (req, res, next) {
            var reg = new RegExp('\/' + (opt.apiPath));
            var apiMatch = req.url.match(reg);
            var query = req.query;
            var tmpFile = '';
            var pathname = opt.dirName + req._parsedUrl.pathname;

            if (apiMatch && apiMatch.length && apiMatch.index === 0 && query && (query.cb || query.callback)) {
                var cbName = query.cb || query.callback;

                if (cbName) {
                    res.setHeader('content-type', 'application/javascript');
                    var readStream = fs.createReadStream(pathname.replace(opt.apiPath, 'source'));

                    return readStream.pipe(through.obj(function (file, env, cb) {

                        tmpFile = 'typeof ' + cbName + ' === "function" && '
                        + cbName + '(' + JSON.stringify(compile(JSON.parse(file.toString()))) + ');'



                        fs.writeFile(pathname, tmpFile, function (err) {
                            if (err) throw err;
                            cb();
                            next();
                        });
                    }));
                }
            }
            next();
        })
}

module.exports = mock;
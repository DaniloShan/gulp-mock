var gulp = require('gulp'),
    gutil = require('gulp-util'),
    through = require('through2'),
    fs = require('fs');

var opt = {};

function compile(model) {
    return JSON.stringify(model);
}

function mock() {

    return through.obj(function (file, enc, cb) {

        var model = JSON.parse(file.contents.toString());

        file.contents = new Buffer(compile(model));

        console.log(file.path);

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

            if (apiMatch && apiMatch.length && apiMatch.index === 0 && query) {
                var cbName = query.cb || query.callback;

                if (cbName) {
                    res.setHeader('content-type', 'application/javascript');
                    var readStream = fs.createReadStream(pathname.replace(opt.apiPath, 'source'));

                    return readStream.pipe(through.obj(function (file, env, cb) {

                        tmpFile = 'typeof ' + cbName + ' === "function" && '
                        + cbName + '(' + file.toString() + ');'

                        console.log(tmpFile, pathname);
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
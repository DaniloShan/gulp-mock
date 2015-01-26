var through = require('through2'),
    fs = require('fs'),
    path = require('path');

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
        dirName: '',
        sourcePath: ''
    };
};

mock.middleware = function (connect) {
    return connect()
        .use(connect.query())
        .use(function (req, res, next) {
            var reg = new RegExp(path.sep + (opt.apiPath));
            var apiMatch = req.url.match(reg);
            var query = req.query;
            var tmpFile = '';
            var pathname = opt.dirName + req._parsedUrl.pathname;

            path.dirname(req._parsedUrl.pathname).split(path.sep).reduce(function (prev, curr) {
                var tmp = opt.dirName + prev + path.sep + curr;
                if (!fs.existsSync(tmp)) {
                    fs.mkdirSync(tmp);
                }
                return prev + path.sep + curr;
            });

            if (apiMatch && apiMatch.length && apiMatch.index === 0) {
                var cbName = query.cb || query.callback;

                if (cbName) {
                    res.setHeader('content-type', 'application/javascript');
                }

                return fs.createReadStream(pathname.replace(opt.apiPath, opt.sourcePath))
                    .pipe(through.obj(function (file, env, cb) {

                        if (cbName) {
                            tmpFile = 'typeof ' + cbName + ' === "function" && '
                            + cbName + '(' + JSON.stringify(compile(JSON.parse(file.toString()))) + ');';
                        } else {
                            tmpFile = JSON.stringify(compile(JSON.parse(file.toString())));
                        }
                        fs.writeFile(pathname, tmpFile, function (err) {
                            if (err) throw err;
                            cb();
                            next();
                        });
                    }));
            }
            next();
        })
};

module.exports = mock;
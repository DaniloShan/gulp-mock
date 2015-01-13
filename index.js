var gulp = require('gulp'),
    gutil = require('gulp-util'),
    through = require('through2');

function compile (model) {
    model["age"] = +new Date();
    return JSON.stringify(model);
}

function mock () {

    return through.obj(function (file, enc, cb) {

        var model = JSON.parse(file.contents.toString());

        file.contents = new Buffer(compile(model));

        console.log(file);

        cb(null, file);
    });
}

module.exports = mock;
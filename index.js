var gulp = require('gulp');

module.exports = {
    init: function () {
        this.cbQueue = [];
        var _self = this;

        gulp.task('mock', function () {
            _self.cbQueue.forEach(function (item) {
                gulp.src(item.url)
                    .pipe(gulp.dest(item.data().path));
            });
        });

        return this;
    },

    add: function (conf) {
        this.cbQueue.push(conf);
        return this;
    },

    config: function (o) {
        this.config = o;

        return this;
    },

    listen: function () {
        console.log('listening');
    }
};
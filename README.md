gulp-mock
===
> Gulp plugin to mock data (for test you know).

## Install

```text
npm install --save-dev gulp-mock
```

## Usage

> All mock template **must** put in the source path.
> All mocked files would be in the api path.
> apiPath, sourcePath, dirName are required.

```js
// in gulpfile.js
var gulp = require('gulp'),
    connect = require('gulp-connect'),
    mock = require('gulp-mock');

const sourcePath = 'source';
const apiPath = 'api';

mock.config({
    sourcePath: sourcePath, // Mock template should put here. e.g: source/path/to/foo.json
    apiPath: apiPath, // Mocked files would be this path. e.g: api/path/to/foo.json
    dirName: __dirname
});

gulp.task('api', function () {
    gulp.src(sourcePath + 'path/to/*.json')
        .pipe(mock()) // Just add this line to what ever files you wanna mocked.
        .pipe(gulp.dest(apiPath + 'path/to/'))
        .pipe(connect.reload())
});

gulp.task('default', ['api', 'server', 'watch']);
```
#### Need live reload and jsonp support?

> Gulp-mock use middleware to handle live reload and jsonp response.

```js
gulp.task('watch', function () {
    gulp.watch('source/**/*.json', ['api']);
});

gulp.task('server', function () {
    connect.server({
        port: 3000,
        livereload: true,
        middleware: function (connect, opt) {
            // Just add this line in middleware. Then you'll get jsonp support and live load.
            return [mock.middleware(connect, opt)];
        }
    });
});
```

#### Mock template

```json
{
  "data|2-10": {
    "code": "String:7",
    "percent": "String:7",
    "tels|2-5": "Number:13|x.xxxxxxxxxxxxxxx",
    "array|5-10": "String:7-12",
    "time": "Date|YYYY-MM-DD",
    "String:4|2-5": {
      "name": "String:7|xxx.xxxx",
      "time": "String:7",
      "String:2-5": "Number:10"
    },
    "avatar": "Image|200x200",
    "thumbnails|2-5": "Image|200x300-400x500"
  }
}
```
Mocked data would like this:

```js
{
  data: [{ // "data|2-10" Should return a array, the array's length should within 2 to 10
    code: "byother", // "String:7" Should return a string, the string's length should equal to 7.
    percent: "upinstr",
    tels: [
      7.558816198259, // "Number:13|x.xxxxxxxxxxxxxxx" Should return a number and transformed like 'x.xxxxxxxxxxxxxxx'.
      4.997925737872,
      4.765942785888
    ],
    array: [
      "oeverymajo", // "String:7-12" Should return a string, the string's length should within 7 to 12.
      "utplaysnbson",
      "lationabo",
      "actorso",
      "terandp",
      "nisedassha",
      "rtainhispla",
      "ainhigh"
    ],
    time: "2015-01-23",
    onal: [ // Random key name, in case sometime we need that.
      {
        name: "the.grea", // "String:7|xxx.xxxx" Just work.
        time: "reemine",
        dt: 3782816532
      },
      {
        name: "sus.anna",
        time: "tilabou",
        tth: 5975610705
      },
      {
        name: "ces.andc",
        time: "ndbroug",
        lon: 2345818821
      },
      {
        name: "rig.htsh",
        time: "eoftheb",
        clu: 6192378209
      },
      {
        name: "few.reco",
        time: "olarshi",
        hts: 4497031601
      }
    ],
    avatar: "data:image/png;base64,iVBORw0KGg...", // "Image|200x200" Canvas Image, with 200px width and 200px height.
    thumbnails: [
      "data:image/png;base64,iVBORw0KGg...", // "Image|200x300-400x500" Canvas Image, with 200px to 300px  width and 400px to 500px height.
      "data:image/png;base64,iVBORw0KGg...",
      "data:image/png;base64,iVBORw0KGg...",
      "data:image/png;base64,iVBORwAADM...",
      "data:image/png;base64,iVBORw0KGg..."
    ]
  }] // and more
}
```

You also can write a mock template like this:
```json
[{
  "data": "..."
}, "2-5"]
```
It'll return an array, and it's length should within 2 to 5.
Also you can skip `"2-5"`, it'll return a array which length should within 1 to 20.
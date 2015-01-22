var should = require('should');

var mock = require('../index');
var compile = require('../compile');

var Canvas = require('canvas'),
    img = new Canvas.Image();

describe('gulp-mock', function () {

    describe('compile private helper', function () {
        it('compile.replace', function () {
            compile.replace('123456789012345', '_=+321FFFxxbbbssww<<<ffssxxwwxxxxx[xx]]]ss{}xx()_ww(x)wx')
                .should.be.eql('_=+321FFF12bbbssww<<<ffss34ww56789[01]]]ss{}23()_ww(4)w5');
            compile.replace('1234567890')
                .should.be.a.String.and.eql('1234567890');
            compile.replace(1234567890)
                .should.be.a.Number.and.eql(1234567890);
        });

        it('compile.getImageSize', function () {
            compile.getImageSize().should.be.eql([100, 100]);
            compile.getImageSize('200x100').length.should.be.eql(2);
            compile.getImageSize('200x100').should.be.eql([200, 100]);

            var result1 = compile.getImageSize('200x100-300x500');
            result1.length.should.be.eql(2);
            result1[0].should.be.within(200, 300);
            result1[1].should.be.within(100, 500);

            var result2 = compile.getImageSize('300x500-200x100');
            result2.length.should.be.eql(2);
            result2[0].should.be.within(200, 300);
            result2[1].should.be.within(100, 500);
        });

        it('compile.buildString', function () {
            compile.buildString().length.should.be.eql(10);
            compile.buildString().should.be.a.String;
            compile.buildString(10).length.should.be.within(0, 10);
            compile.buildString(10).should.be.a.String;
            compile.buildString(0, 10).length.should.be.within(0, 10);
            compile.buildString(0, 10).should.be.a.String;
            compile.buildString(10, 0).length.should.be.within(0, 10);
            compile.buildString(10, 0).should.be.a.String;
            compile.buildString(10, 30).length.should.be.within(10, 30);
            compile.buildString(10, 30).should.be.a.String;
        });

        it('compile.buildNumber', function () {
            compile.buildNumber().should.be.within(0, 10e10);
            compile.buildNumber().should.be.a.Number;
            compile.buildNumber(10).should.be.within(0, 10e10);
            compile.buildNumber(10).should.be.a.Number;
            compile.buildNumber(0, 10).should.be.within(0, 10e10);
            compile.buildNumber(0, 10).should.be.a.Number;
            compile.buildNumber(10, 0).should.be.within(0, 10e10);
            compile.buildNumber(10, 0).should.be.a.Number;
            compile.buildNumber(10, 30).should.be.within(10e10, 10e30);
            compile.buildNumber(10, 30).should.be.a.Number;
        });

        it('compile.buildDate', function () {
            var date = new Date();
            var today = date.getFullYear() + ':' + (date.getMonth() + 1 < 10
                    ? '0' + (date.getMonth() + 1)
                    : date.getMonth() + 1) + ':' + date.getDate();

            compile.buildDate('YYYY:MM:DD').should.be.a.String.and.eql(today);
        });

        it('compile.buildImage with 0 args \n result img should have 100px width and 100px height', function () {
            var result = compile.buildImage();

            result.should.be.a.String;
            result.indexOf('data:image/png;base64,').should.be.eql(0);

            img.src = result;
            img.width.should.be.eql(100);
            img.height.should.be.eql(100);
        });

        it('compile.buildImage with 1 args: 200x300 \n result img should have 200px width and 300px height'
            , function () {
                var result = compile.buildImage('200x300');

                result.should.be.a.String;
                result.indexOf('data:image/png;base64,').should.be.eql(0);

                img.src = result;
                img.width.should.be.eql(200);
                img.height.should.be.eql(300);
            });

        it('compile.buildImage with 1 args: 300x200 \n result img should have 300px width and 200px height'
            , function () {
                var result = compile.buildImage('300x200');

                result.should.be.a.String;
                result.indexOf('data:image/png;base64,').should.be.eql(0);

                img.src = result;
                img.width.should.be.eql(300);
                img.height.should.be.eql(200);
            });

        it('compile.buildImage with 1 args: 200x300-400x500 \n result img\'s width should within 200px and 400px\n' +
            ' and height should within 300px and 500px'
            , function () {
                var result = compile.buildImage('200x300-400x500');

                result.should.be.a.String;
                result.indexOf('data:image/png;base64,').should.be.eql(0);

                img.src = result;
                img.width.should.be.within(200, 400);
                img.height.should.be.within(300, 500);
            });

        it('compile.buildImage with 1 args: 400x500-200x300 \n result img\'s width should within 200px and 400px\n' +
            ' and height should within 300px and 500px'
            , function () {
                var result = compile.buildImage('400x500-200x300');

                result.should.be.a.String;
                result.indexOf('data:image/png;base64,').should.be.eql(0);

                img.src = result;
                img.width.should.be.within(200, 400);
                img.height.should.be.within(300, 500);
            });

        it('compile.buildByKey', function () {
            var result = compile.buildByKey('tels|2-5', 'Number:13|x.xxxxxxxxxxxxxxx');

            result[0].should.be.eql('tels');
            result[1].should.be.a.Array;
            result[1].length.should.be.within(2, 5);
            result[1][0].should.be.a.Number;
            result[1][0].should.be.within(0, 10);
        });
    });

    describe('compile main function', function () {
        it('should return a mocked JSON', function () {
            var date = new Date();
            var today = date.getFullYear() + ':' + (date.getMonth() + 1 < 10
                    ? '0' + (date.getMonth() + 1)
                    : date.getMonth() + 1) + ':' + date.getDate();

            compile({
                "testArray|2-5": {}
            }).testArray.should.be.a.Array;
            compile({
                "testArray|2-5": {}
            }).testArray.length.should.be.within(2, 5);

            compile({
                "testArray|2-5": {
                    "tels|2-5": "Number:13|x.xxxxxxxxxxxxxxx"
                }
            }).testArray.length.should.be.within(2, 5);
            compile({
                "testArray|2-5": {
                    "tels|2-5": "Number:13|x.xxxxxxxxxxxxxxx"
                }
            }).testArray[0].tels.should.be.a.Array;
            compile({
                "testArray|2-5": {
                    "tels|2-5": "Number:13|x.xxxxxxxxxxxxxxx"
                }
            }).testArray[0].tels.length.should.be.within(2, 5);
            compile({
                "testArray|2-5": {
                    "tels|2-5": "Number:13|x.xxxxxxxxxxxxxxx"
                }
            }).testArray[0].tels[0].should.be.a.Number;

            compile([{
                "data": "String:2-5"
            }]).should.be.a.Array;
            compile([{
                "data": "String:2-5"
            }]).length.should.be.within(1, 20);

            compile([{
                "data": "String:2-5"
            }, "5-10"]).length.should.be.within(5, 10);

            compile([{
                "data": "String:2-5"
            }, "5"]).length.should.be.eql(5);

            var template = {
                "data|2-10": {
                    "code": "String:7",
                    "percent": "String:7-12",
                    "tels|2-5": "Number:13|x.xxxxxxxxxxxxxxx",
                    "array|5-10": "String:7",
                    "time": "Date|YYYY:MM:DD",
                    "family|2-5": {
                        "name": "String:7",
                        "time": "String:7"
                    },
                    "avatar": "Image|200x200"
                }
            };
            var result = compile(template);

            result.data.should.be.a.Array;
            result.data.length.should.be.within(2, 10);

            result.data[0].code.should.be.a.String;
            result.data[0].code.length.should.eql(7);

            result.data[0].percent.should.be.a.String;
            result.data[0].percent.length.should.within(7, 12);

            result.data[0].tels.should.be.a.Array;
            result.data[0].tels.length.should.within(2, 5);
            result.data[0].tels[0].should.within(0, 10);

            result.data[0].time.should.be.eql(today);

            result.data[0].avatar.indexOf('data:image/png;base64,').should.be.eql(0);
            img.src = result.data[0].avatar;
            img.width.should.be.eql(200);
            img.height.should.be.eql(200);

        });
    });

});
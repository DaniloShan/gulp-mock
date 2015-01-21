var should = require('should');

var mock = require('../index');
var compile = require('../compile');

describe('gulp-mock', function () {

    describe('compile', function () {
        it('compile.buildDate', function () {
            var date = new Date();
            var today = date.getFullYear() + ':' + (date.getMonth() + 1 < 10
                    ? '0' + (date.getMonth() + 1)
                    : date.getMonth() + 1) + ':' + date.getDate();

            compile.buildDate('YYYY:MM:DD').should.be.a.String.and.eql(today);
        });

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
    });

});
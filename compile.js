// TODO: filter support
// TODO: unit test
// TODO: docs

var _ = require('lodash');
var moment = require('moment');
var cache = {};
var paragraph = 'williamshakespeareaprilbaptisedaprilnbwasanenglishpoetplaywrightandactorwidelyregardedasthegreatestwriterintheenglishlanguageandtheworldspreeminentdramatistheisoftencalledenglandsnationalpoetandthebardofavonnbhisextantworksincludingsomecollaborationsconsistofaboutplaysnbsonnetstwolongnarrativepoemsandafewotherversesofwhichtheauthorshipofsomeisuncertainhisplayshavebeentranslatedintoeverymajorlivinglanguageandareperformedmoreoftenthanthoseofanyotherplaywrightshakespearewasbornandbroughtupinstratforduponavonattheageofhemarriedannehathawaywithwhomhehadthreechildren:susannaandtwinshamnetandjudithbetweenandhebeganasuccessfulcareerinlondonasanactorwriterandpartownerofaplayingcompanycalledthelordchamberlainsmenlaterknownasthekingsmenheappearstohaveretiredtostratfordaroundatagewherehediedthreeyearslaterfewrecordsofshakespearesprivatelifesurviveandtherehasbeenconsiderablespeculationaboutsuchmattersashisphysicalappearancesexualityreligiousbeliefsandwhethertheworksattributedtohimwerewrittenbyothersshakespeareproducedmostofhisknownworkbetweenandnbhisearlyplaysweremainlycomediesandhistoriesandtheseworksremainregardedassomeofthebestworkproducedinthesegenreshethenwrotemainlytragediesuntilaboutincludinghamletkinglearothelloandmacbethconsideredsomeofthefinestworksintheenglishlanguageinhislastphasehewrotetragicomediesalsoknownasromancesandcollaboratedwithotherplaywrightsmanyofhisplayswerepublishedineditionsofvaryingqualityandaccuracyduringhislifetimeinjohnhemingesandhenrycondelltwofriendsandfellowactorsofshakespearepublishedthefirstfolioacollectededitionofhisdramaticworksthatincludedallbuttwooftheplaysnowrecognisedasshakespearesitwasprefacedwithapoembybenjonsoninwhichshakespeareishailedprescientlyasnotofanagebutforalltimeinthethandstcenturyhisworkhasbeenrepeatedlyadoptedandrediscoveredbynewmovementsinscholarshipandperformancehisplaysremainhighlypopulartodayandareconstantlystudiedperformedandreinterpretedindiverseculturalandpoliticalcontextsthroughouttheworld';
var plen = paragraph.length;

function buildString (min, max) {
    var length = _.random(min, max);
    while (plen < length) {
        paragraph += paragraph;
        plen = paragraph.length
    }
    var start = _.random(plen - length - 1);

    return paragraph.slice(start, start + length);
}
function buildNumber (min, max) {
    var length = _.random(min, max) - 1;
    var num = _.random(0.0, 0.8);
    num += 0.1;
    return Math.floor((+('10e' + length) * num));
}
function buildDate (filter) {
    return moment().format(filter || 'YYYY-MM-DD');
}

function buildByVal(str) {
    if (cache[str]) return cache[str];
    if (!str) return str;

    var arrStr = str.split('|');
    arrStr[0] = arrStr[0].split(':');

    var dataType = arrStr[0][0];
    var dataLength = arrStr[0][1];
    var dataFilter = arrStr[1];
    var lenMin = 0, lenMax = 10;

    if (dataLength) {
        dataLength = dataLength.split('-');
        if (dataLength.length === 1) {
            lenMax = +dataLength[0];
            lenMin = +dataLength[0];
        } else {
            lenMin = +dataLength[0];
            lenMax = +dataLength[1];
        }
    }

    switch (dataType) {
        case 'String':
            return buildString(lenMin, lenMax);
            break;
        case 'Number':
            return buildNumber(lenMin, lenMax);
            break;
        case 'Date':
            return buildDate(dataFilter);
            break;
    }

    return str;
}

function buildByKey(key, val) {
    key = key.split('|');
    key[0] = key[0].split(':');

    var keyType = key[0][0];
    var keyLength = key[0][1];
    var dataLength = key[1];
    var lenMin = 1, lenMax, i = 0, il;

    if (!dataLength) {
        if (keyLength) {
            key = buildByVal(keyType + ':' + keyLength);
        }
    } else {
        dataLength = dataLength.split('-');
        lenMin = +dataLength[0] <= 1 ? 1 : +dataLength[0];
        lenMax = +dataLength[1] >= lenMin ? +dataLength[1] : lenMin;

        il = _.random(lenMin, lenMax);

        var result = [];

        if (_.isObject(val)) {
            for (; i < il; i++) {
                result.push(compile(val));
            }
        } else {
            for (; i < il; i++) {
                result.push(buildByVal(val));
            }
        }

        if (keyLength) {
            key = buildByVal(keyType + ':' + keyLength);
        } else {
            key = keyType;
        }
        return [key, result];
    }

    if (_.isObject(val)) {
        return [key, compile(val)];
    }

    return [key, buildByVal(val)];
}

function compile(template) {
    var result = {}, item;

    _.forOwn(template, function (val, key) {
        if (~key.indexOf(':') || ~key.indexOf('|')) {
            item = buildByKey(key, val);
            result[item[0]] = item[1];
        } else {
            if (_.isObject(val)) {
                result[key] = compile(val);
            } else {
                result[key] = buildByVal(val);
            }
        }
    });

    return result;
}

module.exports = compile;
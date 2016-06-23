/**
 * Created by berkozdilek on 23/06/16.
 */

var chai = require('chai');
var expect = chai.expect;
var ivencloud = require('../index');

describe('activation function parameters : non-string', function () {
    it('passing non string both', function () {
        ivencloud.activate(1, 2,
        function (response) {
            expect(response).to.equal(0);
        });
    });

    it('passing non string first', function () {
        ivencloud.activate(1, "2",
            function (response) {
                expect(response).to.equal(0);
            });
    });

    it('passing non string second', function () {
        ivencloud.activate("1", 2,
            function (response) {
                expect(response).to.equal(0);
            });
    });
});

describe('activation function parameters : empty string', function () {
    it('passing non string both', function () {
        ivencloud.activate("", "",
            function (response) {
                expect(response).to.equal(0);
            });
    });

    it('passing non string first', function () {
        ivencloud.activate("asd", "",
            function (response) {
                expect(response).to.equal(0);
            });
    });

    it('passing non string second', function () {
        ivencloud.activate("", "asd",
            function (response) {
                expect(response).to.equal(0);
            });
    });
});

describe('activation function parameters : callback', function () {
    it('callback is null', function () {
        var r = ivencloud.activate("", "", null);
        expect(r).to.equal(0);
    });

    it('callback is not a function', function () {
        var r = ivencloud.activate("", "", "");
        expect(r).to.equal(0);
    });
});

describe('sendData function parameters : data', function () {

    it('is null', function () {
        ivencloud.sendData(null, function (response) {
                expect(response).to.equal(0);
            });
    });

    it('is not a obj', function () {
        ivencloud.sendData("", function (response) {
            expect(response).to.equal(0);
        });
    });
});

describe('sendData function parameters : callback', function () {
    it('callback is null', function () {
        var r = ivencloud.sendData({ n: 0}, null);
        expect(r).to.equal(0);
    });

    it('callback is not a function', function () {
        var r = ivencloud.sendData({a: 0}, "");
        expect(r).to.equal(0);
    });
});

describe('sendDataWithLoop function parameters : freq', function () {
    it('freq is smaller than zero', function () {
        ivencloud.senDataWithLoop({ n: 0}, -1, function (response) {
            expect(response).to.equal(0); 
        });
    });
});
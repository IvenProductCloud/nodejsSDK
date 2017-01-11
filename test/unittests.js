/**
 * Created by berkozdilek on 23/06/16.
 */

var chai = require('chai');
var expect = chai.expect;
var ivencloud = require('../index');

describe('activation', function () {
    it('no credentials', function () {
        ivencloud.activate(function (err, res) {
            expect(err).to.be.an('error');
            expect(res).to.be.an('undefined');
        });
    });

    it('calling setCredentials', function () {
      ivencloud.setCredentials({deviceUid:"x", secretKey:"y"})
        ivencloud.activate(function (err, res) {
              expect(err).to.be.an('error');
              expect(res).to.be.an('object');
            });
    });

    it('inside activation', function () {
        ivencloud.activate({deviceUid:"x", secretKey:"y"},
            function (err, res) {
                expect(err).to.be.an('error');
                expect(res).to.be.an('object');
            });
    });
});

describe('send data', function () {
    it('no credentials', function () {
        ivencloud.sendData({num:1}, function (err, res) {
            expect(err).to.be.an('error');
            expect(res).to.be.an('undefined');
        });
    });

    it('calling setCredentials', function () {
      ivencloud.setCredentials({deviceUid:"x", secretKey:"y"})
        ivencloud.sendData({num:1}, function (err, res) {
              expect(err).to.be.an('error');
              expect(res).to.be.an('object');
            });
    });

    it('inside send data', function () {
        ivencloud.sendData({deviceUid:"x", secretKey:"y"},
                           {num:1}, function (response) {
                expect(err).to.be.an('error');
                expect(res).to.be.an('object');
            });
    });

    it('api key send data', function () {
        ivencloud.sendData({apiKey:"x"},
                           {num:1}, function (response) {
                expect(err).to.be.an('error');
                expect(res).to.be.an('object');
            });
    });
});

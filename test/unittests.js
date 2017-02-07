/**
 * Created by berkozdilek on 23/06/16.
 */

var chai = require('chai');
var expect = chai.expect;
var ivencloud = require('../index');


describe('#setCredentials()', function () {
    it('sets the credentials', function () {
        let ivencloud = reRequire();
        var r = ivencloud.setCredentials({
            deviceUid: "cc3200",
            secretKey: "9a03deafb9e47da404522e03f1145edb7d9c3b97"
        });
        expect(ivencloud.activationCode).to.not.empty;
        expect(ivencloud.uid).to.not.empty;
        expect(ivencloud.secretKey).to.not.empty;
        expect(r).to.be.ok
    });
    it('should not set if missing deviceUid', function () {
        let ivencloud = reRequire();
        var r = ivencloud.setCredentials({
            secretKey: "9a03deafb9e47da404522e03f1145edb7d9c3b97"
        });
        expect(ivencloud.activationCode).to.empty;
        expect(ivencloud.uid).to.empty;
        expect(ivencloud.secretKey).to.empty;
        expect(r).to.not.be.ok
    });

    it('should not set if missing secretKey', function () {
        let ivencloud = reRequire();
        var r = ivencloud.setCredentials({
            deviceUid: "cc3200"
        });
        expect(ivencloud.activationCode).to.empty;
        expect(ivencloud.uid).to.empty;
        expect(ivencloud.secretKey).to.empty;
        expect(r).to.not.be.ok
    });
    it('should not set with empty parameters', function () {
        let ivencloud = reRequire();
        var r = ivencloud.setCredentials({
        });
        expect(ivencloud.activationCode).to.empty;
        expect(ivencloud.uid).to.empty;
        expect(ivencloud.secretKey).to.empty;
        expect(r).to.not.be.ok
    });
    it('sets api key', function () {
        let ivencloud = reRequire();
        var r = ivencloud.setCredentials({
            apiKey: "6fcf4sa7c224de7e08243ae05204002dcb910d337"
        });
        expect(ivencloud.apiKey).to.not.empty;
        expect(r).to.be.ok
    });
});

describe('#activation()', function () {
    describe('passing options', function () {
        it('should return error if credentials are wrong', function (done) {
            let ivencloud = reRequire();
            ivencloud.activate({
                deviceUid: "",
                secretKey: ""
            },
                function (err, res) {
                    check(done, function () {
                       expect(err).to.error;
                    });
            });
        });
        it('activates the device', function (done) {
            let ivencloud = reRequire();
            ivencloud.activate({
                deviceUid: "cc3200",
                secretKey: "9a03deafb9e47da404522e03f1145edb7d9c3b97"
            },
                function (err, res) {
                    check(done, function () {
                        expect(err).to.null;
                        expect(res).to.have.property('apiKey');
                });
            });
        });
    });

    describe('calling setCredentials', function () {
        it('should return error if no credentials are given', function (done) {
            let ivencloud = reRequire();
            ivencloud.activate(
                function (err, res) {
                    check(done, function () {
                        expect(err).to.error;
                    });
                });
        });
        it('should return error if credentials are wrong', function (done) {
            let ivencloud = reRequire();
            ivencloud.setCredentials({
                deviceUid: "s",
                secretKey: "s"
            });
            ivencloud.activate(
                function (err, res) {
                    check(done, function () {
                        expect(err).to.error;
                    });
                });
        });
        it('activates the device', function (done) {
            let ivencloud = reRequire();
            ivencloud.setCredentials({
                deviceUid: "cc3200",
                secretKey: "9a03deafb9e47da404522e03f1145edb7d9c3b97"
            });
            ivencloud.activate(
                function (err, res) {
                    check(done, function () {
                        expect(err).to.null;
                        expect(res).to.have.property('apiKey');
                    });
                });
        });
    });
});

describe('#sendData()', function () {
    describe('passing options', function () {
        describe('passing deviceUid and secretKey', function () {
            it('sends data', function (done) {
                let ivencloud = reRequire();
                ivencloud.sendData({
                        deviceUid: "cc3200",
                        secretKey: "9a03deafb9e47da404522e03f1145edb7d9c3b97"
                    },
                    {num:0, str:""},
                    function (err, res) {
                        check(done, function () {
                            expect(err).to.null;
                            expect(res).have.property('status', 200);
                        });
                    });
            });
            it('should return error if missing parameter', function (done) {
                let ivencloud = reRequire();
                ivencloud.sendData({
                        secretKey: "9a03deafb9e47da404522e03f1145edb7d9c3b97"
                    },
                    {num:0, str:""},
                    function (err, res) {
                        check(done, function () {
                            expect(err).to.error;
                        });
                    });
            });
        });
        describe('passing apiKey', function () {
            it('sends data', function (done) {
                let ivencloud = reRequire();
                ivencloud.sendData({
                        apiKey: "6fcf4a7c224de7e08243ae05204002dcb910d337"
                    },
                    {num:0, str:""},
                    function (err, res) {
                        check(done, function () {
                            expect(err).to.null;
                            expect(res).have.property('status', 200);
                        });
                    });
            });
            it('should return error if apiKey is wrong', function (done) {
                let ivencloud = reRequire();
                ivencloud.sendData({
                        apiKey: "6ssssfcf4a7c224de7e08243ae05204002dcb910d337"
                    },
                    {num:0, str:""},
                    function (err, res) {
                        check(done, function () {
                            expect(err).to.error;
                        });
                    });
            });
        });
    });
    describe('calling setCredentials', function () {
        it('sends data', function (done) {
            let ivencloud = reRequire();
            ivencloud.setCredentials({
                deviceUid: "cc3200",
                secretKey: "9a03deafb9e47da404522e03f1145edb7d9c3b97"
            });
            ivencloud.sendData({num:0, str:""},
                function (err, res) {
                    check(done, function () {
                        expect(err).to.null;
                        expect(res).have.property('status', 200);
                    });
                });
        });
        it('should return if credentials missing', function (done) {
            let ivencloud = reRequire();
            ivencloud.setCredentials({
                secretKey: "9a03deafb9e47da404522e03f1145edb7d9c3b97"
            });
            ivencloud.sendData({num:0, str:""},
                function (err, res) {
                    check(done, function () {
                        expect(err).to.error;
                    });
                });
        });
        it('should return if credentials not set', function (done) {
            let ivencloud = reRequire();
            ivencloud.sendData({num:0, str:""},
                function (err, res) {
                    check(done, function () {
                        expect(err).to.error;
                    });
                });
        });
    });
});

describe('#getTasks', function () {
    it('gets tasks', function (done) {
        let ivencloud = reRequire();
        ivencloud.getTasks({
                apiKey: "6fcf4a7c224de7e08243ae05204002dcb910d337"
            },
            function (err, res) {
                check(done, function () {
                    expect(err).to.null;
                    expect(res).have.property('taskCode');
                    expect(res).have.property('taskValue');
                });
            });
    });
    it('should return error if apiKey is wrong', function (done) {
        let ivencloud = reRequire();
        ivencloud.getTasks({
                apiKey: "6ssssfcf4a7c224de7e08243ae05204002dcb910d337"
            },
            function (err, res) {
                check(done, function () {
                    expect(err).to.error;
                });
            });
    });
});

describe('#taskDone', function () {
    it('gets tasks', function (done) {
        let ivencloud = reRequire();
        ivencloud.taskDone({
                apiKey: "6fcf4a7c224de7e08243ae05204002dcb910d337"
            },
            3000,
            function (err, res) {
                check(done, function () {
                    expect(err).to.null;
                    expect(res).have.property('status', 200);
                });
            });
    });
    it('should return error if apiKey is wrong', function (done) {
        let ivencloud = reRequire();
        ivencloud.taskDone({
                apiKey: "6ssssfcf4a7c224de7e08243ae05204002dcb910d337"
            },
            1000,
            function (err, res) {
                check(done, function () {
                    expect(err).to.error;
                });
            });
    });
});

function check(done, f) {
    try {
        f();
        done();
    } catch(e) {
        done(e);
    }
}

function reRequire() {
    delete require.cache[require.resolve('../index')]
    return require('../index');
}
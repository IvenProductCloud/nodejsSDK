/**
 * Created by berkozdilek on 15/06/16.
 */

// third party dependencies
var request = require('request');
var cryptoJS = require("crypto-js");

var Ivencloud = function () {
    // this._apiKey = "";
    // this._frequency = 0;
    // console.log('hi');
}
var ApiKey = "";

// Ivencloud.prototype.apiKey = new String("");
Ivencloud.prototype.activate = function(deviceId, secretKey, callback){
    // console.log('activate ');
    // TODO: check deviceId and secretKey is not NULL
    var activationCode = cryptoJS.HmacSHA1(deviceId, secretKey);
    // console.log('he  ' + activationCode);

    var options = {
        url: 'http://demo.iven.io/activate/device',
        headers: {
            'Activation': activationCode
        }
    };

    request(options, function (error, response, body) {
        if (!error){
            // check header content-type if json
            var res = {
                ivenCode: "",
                description: "",
                apiKey: ""
            };
            if (response.statusCode < 500) {
                if (response.headers['content-type'].includes("application/json")) {
                    // parse json
                    var info = JSON.parse(body);
                    if (info.hasOwnProperty('api_key')){
                        res.apiKey = info.api_key;
                        // this.apiKey = new String(info.api_key);
                        ApiKey = info.api_key;
                    }
                    if (info.hasOwnProperty('ivenCode'))
                        res.ivenCode = info.ivenCode;
                    if (info.hasOwnProperty('description'))
                        res.description = info.description;
                    // console.log(res);

                    // call callback and return response object
                    // console.log('api key ' + this.apiKey);
                    callback(res);
                    // console.log('api key ' + this.apiKey);
                } else { // content-type is no json
                    console.log("no json");
                }
            } else { // responseCode > 500
                console.log(response.statusCode);
            }
        } else { // error on request
            console.log(error);
        }
    });
}

Ivencloud.prototype.sendData = function (data, callback) {
    // check api if it is not null
    // console.log("apk " + ApiKey);
    // TODO: check data if null
    if (ApiKey != "") {

        var body = {data:[]};
        body.data.push(data);
        // console.log(JSON.stringify(body));
        // make the request
        var options = {
            method: 'POST',
            url: 'http://demo.iven.io/data/',
            headers: {
                'Content-Type' : 'application/json',
                'API-KEY': ApiKey
            },
            body: JSON.stringify(body)
        };
        // console.log(options);
        request(options, function (error, response, body) {
            if (!error){
                var res = {
                    ivenCode: "",
                    description: "",
                    apiKey: ""
                };
                if (response.statusCode < 500) {
                    if (response.headers['content-type'].includes("application/json")) {
                        // parse json
                        var info = JSON.parse(body);
                        if (info.hasOwnProperty('api_key'))
                            res.apiKey = info.api_key;
                        if (info.hasOwnProperty('ivenCode'))
                            res.ivenCode = info.ivenCode;
                        if (info.hasOwnProperty('description'))
                            res.description = info.description;

                        // call callback and return response object
                        callback(res);
                    } else { // content-type is not json
                        console.log("content=type is not json");
                    }
                } else { // statusCode > 500
                    console.log(response.statusCode);
                }
            } else { // error on request

            }
        });
    } else {
        console.log('api key is null');
    }
}

Ivencloud.prototype.senDataWithLoop = function (data, freq, callback) {
    var self = this;
    setInterval(function() {
        self.sendData(data,callback);
    }, freq*1000);

}

module.exports = new Ivencloud();
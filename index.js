/**
 * Created by berkozdilek on 15/06/16.
 *
 * ivencloud is a nodejs package for connecting devices to Iven Cloud.
 * Checkout the examples folder to see examples.
 * Further examples and guides can be found in iven blog : http://blog.iven.io
 */

// third party dependencies
var request = require('request');
var cryptoJS = require("crypto-js");

var Ivencloud = function () {

}
var ApiKey = "";

/**
 * Activate device. Device must be activated to be able to send data
 *
 * @param {String} deviceId
 * @param {String} secretKey
 * @param callback
 * @returns {*}
 */
Ivencloud.prototype.activate = function(deviceId, secretKey, callback){

    if (callback === null | typeof callback !== 'function')
        return 0;
    if (typeof deviceId !== 'string' | typeof secretKey !== 'string')
        return callback(0);
    if (deviceId === '' | secretKey === '')
        return callback(0);
    
    var activationCode = cryptoJS.HmacSHA1(deviceId, secretKey);
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

                    callback(res);
                } else { // content-type is no json
                    // console.log("no json");
                    return callback(0);
                }
            } else { // responseCode > 500
                // console.log(response.statusCode);
                return callback(0);
            }
        } else { // error on request
            // console.log(error);
            return callback(0);
        }
    });
}

/**
 * Checks the object if its empty
 *
 * @param obj
 * @returns {boolean} true if empty
 */
function isEmpty(obj){
    for (var prop in obj) if (obj.hasOwnProperty(prop)) return false;
    return true;
}

/**
 * Sends data to Iven Cloud.
 *
 * @param data
 * @param callback
 * @returns {*}
 */
Ivencloud.prototype.sendData = function (data, callback) {

    if (callback === null | typeof callback !== 'function')
        return 0;
    if (typeof data !== 'object')
        return callback(0)
    if (isEmpty(data))
       return callback(0)
    
    
    if (data | data !== "null" && data !== "undefined")
    if (ApiKey != "") {

        var body = {data:[]};
        body.data.push(data);
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
                    // console.log(response.statusCode);
                    return callback(0);
                }
            } else { // error on request
                // console.log(response.statusCode);
                return callback(0);
            }
        });
    } else {
        // console.log('api key is null');
        callback(0);
    }
}

/**
 * Sends data every given seconds
 *
 * @param data
 * @param freq as seconds
 * @param callback
 */
Ivencloud.prototype.senDataWithLoop = function (data, freq, callback) {

    if (freq <= 0)
        callback(0);
    
    var self = this;
    setInterval(function() {
        self.sendData(data,callback);
    }, freq*1000);

}

/**
 *
 * @type {Ivencloud}
 */
module.exports = new Ivencloud();
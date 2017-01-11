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

const State = {
    NONE:         0,
    INITILIAZED:  1,
    ACTIVATED:    2,
    print: function (s) {
        switch (s) {
            case 0: return "NONE";
            case 1: return "INITILIAZED";
            case 2: return "ACTIVATED";
        }}};

var Ivencloud = function() {
  this.uid = "";
  this.secretKey = "";
  this.activationCode = "";
  this.state = State.NONE;
  this.apiKey = "";
  this.hostname = "demo.iven.io";
};

Ivencloud.prototype.setCredentials = function(creds) {
    if (creds.hostname) {
      this.hostname = creds.hostname;
    }
    if (creds.apiKey) {
      this.apiKey = creds.apiKey;
      this.state = State.ACTIVATED;
    } else {
      if (!creds.deviceUid || !creds.secretKey) {
        return;
      }
      this.uid = creds.deviceUid;
      this.secretKey = creds.secretKey;
      this.activationCode = cryptoJS.HmacSHA1(creds.deviceUid, creds.secretKey);
      this.state = State.INITILIAZED;
    }
};

Ivencloud.prototype.sendData = function(options, data, callback) {
  if (callback == null && typeof data == 'function') {
    callback = data;
    data = options;
    options = null;
  }
  var task = 0;
    if (options) {
      this.setCredentials(options);
      if (options.task)
        task = options.task;
    }


    if (this.State != State.ACTIVATED) {
      this.activate(function(err, res) {
        if (!err) {
          sendDataRequest.call(this,this.hostname, this.apiKey, data, true, task, callback);
        } else {
          callback(err, res);
        }
      }.bind(this));
    } else {
    sendDataRequest.call(this,this.hostname, this.apiKey, data, true, task, callback);
    }
};

Ivencloud.prototype.activate = function(options, callback) {
  if (callback == null && typeof options == 'function') {
    callback = options;
    options = null;
  }
  if (options) {
    this.setCredentials(options);
  } else if (this.state == State.NONE) {
      return callback(new Error("credentials can't found"));
    }

var reqOpt= {
    url: generateActURL(this.hostname),
    headers: {
        'Activation': this.activationCode
    }
};

request(reqOpt, function (error, response, body) {
    if (!error) {
        if (response.statusCode < 500 ||
            response.headers['content-type'].includes("application/json")) {
              var info = JSON.parse(body);
              var ivenCode = info.ivenCode;
              if (ivenCode == 1001 || ivenCode == 1002) {
                callback(new Error(info.description), info);
              } else {
                if (info.hasOwnProperty('api_key')){
                  this.apiKey = info.api_key;
                  this.state = State.ACTIVATED;
                }
                callback(null, info);
              }
        } else { // responseCode > 500 or no json body
            callback(new Error('Something gone wrong with the server'));
        }
    } else { // error on request
        return callback(new Error('Error making request: '+ error));
    }
}.bind(this));

};

Ivencloud.prototype.getTasks = function(callback) {
  this.sendData({FEED:"T"}, function(err, res) {
      if (err) {
        callback(err, res);
      }
      else {
        var ret = {taskCode:0, taskValue:""};
        if (res.ivenCode >= 2000) {
          ret.taskCode = res.ivenCode;
          if (res.hasOwnProperty('task'))
            ret.taskValue = res.task;
        }
        callback(null, ret);
      }
  });
};

Ivencloud.prototype.taskDone = function(taskCode, callback) {
  if (callback == null) {
    callback = function(){};
  }
  this.sendData({task:taskCode}, {FEED:"TD"}, function(err, res) {
      if (err) {
        callback(err, res);
      }
      else {
        callback(null,{status:res.status});
      }
  });
};

var sendDataRequest = function (host, apiKey, body, renewApikey, task, callback) {
  var reqOpt = {
      method: 'POST',
      url: generateSendDtURL(host),
      headers: {
          'Content-Type' : 'application/json',
          'API-KEY': apiKey
      }
      // ,body: JSON.stringify({data:[body]})
  };
  if (task){
    reqOpt.body = JSON.stringify({data:[body], iven_code:task});
  } else {
    reqOpt.body = JSON.stringify({data:[body]});
  }


  request(reqOpt, function (error, response, body) {
    if (!error) {
        if (response.statusCode < 500 ||
            response.headers['content-type'].includes("application/json")) {
              var info = JSON.parse(body);
              var ivenCode = info.ivenCode;
              if (ivenCode == 1004 && renewApikey) {
                this.activate(function(){
                  return sendDataRequest.call(this,host, apiKey, body, false, task, cb);
                });
              } else if (ivenCode == 1001) {
                callback(new Error(ivenCode.description), info);
              } else {
                info.api_key = this.apiKey;
                callback(null, info);
              }
        } else { // responseCode > 500 or no json body
            callback(new Error('Something gone wrong with the server'));
        }
    } else { // error on request
        return callback(new Error('Error making request: '+ error));
    }
  }.bind(this));
};

var generateActURL = function (url) {
  return "http://"+ url +"/activate/device";
};
var generateSendDtURL = function (url) {
  return "http://"+ url +"/data";
};

/**
 * Activate device. Device must be activated to be able to send data
 *
 * @param {String} deviceId
 * @param {String} secretKey
 * @param callback
 * @returns {*}
 */
Ivencloud.prototype.activate_old = function(deviceId, secretKey, callback){

    if (callback === null | typeof callback !== 'function')
        return new Error('The third parameter must be valid callback function, please try again!');
    if (typeof deviceId !== 'string' | typeof secretKey !== 'string')
        return callback(new Error('Device ID or Secret Key might not be a valid String, please try again!'));
    if (deviceId === '' | secretKey === '')
        return callback(new Error('Device ID or Secret Key might be empty, please try again!'));

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
                } else { // content-type is not json
                    // console.log("no json");
                    return callback(new Error('The Content-Type is not json, please check again!'));
                }
            } else { // responseCode > 500
                // console.log(response.statusCode);
                return callback(new Error('The status code was >500, please check again!'));
            }
        } else { // error on request
            // console.log(error);
            return callback(new Error('The server was not responding with a status code of '+response.statusCode+'. Please check again!'));
        }
    });
};

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
Ivencloud.prototype.sendData_old = function (data, callback) {

    if (callback === null | typeof callback !== 'function')
        return new Error('The second parameter must be valid callback function, please try again!');
    if (typeof data !== 'object')
        return callback(new Error('The Api Key provided is not a valid javascript object, please try again!'));
    if (isEmpty(data))
       return callback(new Error('The Api Key provided is empty, please try again!'));


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
                        return callback(new Error('The Content-Type is not json, please check again!'));
                    }
                } else { // statusCode > 500
                    // console.log(response.statusCode);
                  return callback(new Error('The status code was >500, please check again!'));
                }
            } else { // error on request
                // console.log(response.statusCode);
                return callback(new Error('The server was not responding with a status code of '+response.statusCode+'. Please check again!'));
            }
        });
    } else {
        // console.log('api key is null');
        return callback(new Error('The Api Key provided is null, please try again!'));

    }
};

/**
 *
 * @type {Ivencloud}
 */
module.exports = new Ivencloud();

/**
 * ivencloud is a nodejs package for connecting devices to Iven Cloud.
 * Checkout the examples folder to see examples.
 * Further examples and guides can be found in iven blog : http://blog.iven.io
 * @ignore
 */

// third party dependencies
var axios = require("axios");
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

/**
 * Ivencloud
 * @class
 */
var Ivencloud = function() {
    this.uid = "";
    this.secretKey = "";
    this.activationCode = "";
    this.state = State.NONE;
    this.apiKey = "";
    this.hostname = generateBaseURL("staging.iven.io");
};

/**
 * Sets the credentials for authentication.
 * @param {Object} [creds] - The credentials to be set
 * @param {string} creds.deviceUid - Device UId of the device
 * @param {string} creds.secretKey - Secret Key of the hardware profile of  the device
 * @param {string} [creds.apiKey] - API-KEY of the device
 * @param {string} [creds.hostname=demo.iven.io] - Hostname of the server to be connect
 * @memberof Ivencloud
 */
Ivencloud.prototype.setCredentials = function(creds) {
    if (!creds)
        return false;

    if (creds.hostname) {
        this.hostname = generateBaseURL(creds.hostname);
    }
    if (creds.apiKey) {
        this.apiKey = creds.apiKey;
        this.state = State.ACTIVATED;
    } else {
        if (!creds.deviceUid || !creds.secretKey) {
            return false;
        }
        this.uid = creds.deviceUid;
        this.secretKey = creds.secretKey;
        this.activationCode = cryptoJS.HmacSHA1(creds.deviceUid, creds.secretKey);
        this.state = State.INITILIAZED;
    }

    return true;
};

/**
 * Sends data to the cloud. If the device is not activated it will activates the device.
 * If the api key expires it will renew the api key
 *
 * @param {Object} [options] - The credentials to be set. If you set credentials with activate of setCredentials method
 * you dont need to pass anything
 * @param {string} [options.apiKey] - API-KEY of the device
 * @param {string} [options.deviceUid] - Device UId of the device
 * @param {string} [options.secretKey] - Secret Key of the hardware profile of  the device
 * @param {string} [options.apiKey] - API-KEY of the device
 * @param {string} [options.hostname=demo.iven.io] - Hostname of the server to be connect
 * @param {Object} data - The object which keys must match with HW Profile keys at Iven Cloud
 * @param {Ivencloud~callback} callback - Asych. called after sends happen
 * @memberof Ivencloud
 */
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


    if (this.state != State.ACTIVATED) {
        this.activate(function(err, res) {
            if (!err) {
                sendDataRequest.call(this, this.hostname, this.apiKey, data, true, task, callback);
            } else {
                callback(err, res);
            }
        }.bind(this));
    } else {
        sendDataRequest.call(this, this.hostname, this.apiKey, data, true, task, callback);
    }
};

/**
 * Activates the device and sets the api key.
 *
 * @param {Object} [options] - The credentials to be set. If you set device credentials you dont have to
 * pass anything to options
 * @param {string} [options.deviceUid] - Device UId of the device
 * @param {string} [options.secretKey] - Secret Key of the hardware profile of the device
 * @param {Ivencloud~callback} callback - Asych. called after activate happens
 * @memberof Ivencloud
 */
Ivencloud.prototype.activate = function(options, callback) {
    if (callback == null && typeof options == 'function') {
        callback = options;
        options = null;
    }
    if (options) {
        this.setCredentials(options);
    } else if (this.state == State.NONE) {
        return callback(new Error("Credentials can't found"));
    }


    axios.get(activationPath, {
        baseURL: this.hostname,
        headers: {
            'Activation': this.activationCode
        }
    })
        .then(function (response) {
            this.apiKey = response.data.api_key;
            this.state = State.ACTIVATED;
            response.data.apiKey = response.data.api_key;
            delete response.data.api_key;

            callback(null, response.data);
        }.bind(this))
        .catch(function (error) {
            var ivenCode = error.response.data.ivenCode;
            if (error.response.status < 500) {
                callback(new Error(error.response.data.description), error.response.data);
            } else {
                callback(new Error("HTTP Status 500"), null);
            }
        });
};

/**
 * Gets the tasks assigned to device if any
 * @param {Object} [options] - The credentials to be set
 * @param {string} [options.apiKey] - API-KEY of the device
 * @param {Ivencloud~TasksCallback} callback - Asych. called after
 * @memberof Ivencloud
 */
Ivencloud.prototype.getTasks = function(options, callback) {
    if (callback == null && typeof options == 'function') {
        callback = options;
        options = null;
    }
    if (options)
        this.setCredentials(options);


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
    /**
     * Returns the tasks.
     * @callback Ivencloud~TasksCallback
     * @param {(Object|null)}      err - return error object in case of error, else null
     * @param {(Object|undefined)} res - response from the cloud or nothing in case of error
     * @param {number} res.tasCode - task code of the task, zero if no tasks are assigned
     * @param {string} res.taskValue - value of the task, empty if no value
     */
};

/**
 * Sets the task to completed on Iven Cloud. Call this after you handle the related task
 * assigned to device
 *
 * @param {Object} [options] - The credentials to be set
 * @param {string} [options.apiKey] - API-KEY of the device
 * @param {number} taskCode - Code of the completed task
 * @param {Ivencloud~TasksDoneCallback} callback - Asych. called after
 * @memberof Ivencloud
 */
Ivencloud.prototype.taskDone = function(options, taskCode, callback) {
    if (typeof options == 'number') {
        taskCode = options;
        options = null;
        callback = function(){};
    } else if (typeof taskCode == 'callback') {
        callback = taskCode;
        taskCode = options;
        options = null;
    }
    if (options)
        this.setCredentials(options);


    this.sendData({task:taskCode}, {FEED:"TD"}, function(err, res) {
        if (err) {
            callback(err, res);
        }
        else {
            callback(null,{status:res.status});
        }
        /**
         * Returns the tasks.
         * @callback Ivencloud~TasksDoneCallback
         * @param {(Object|null)}      err - return error object in case of error, else null.
         * @param {(Object|undefined)} res - response from the cloud or nothing in case of error.
         * @param {number} res.status - 200 if successful*
         */
    });
};

var sendDataRequest = function (host, apiKey, body, renewApikey, task, callback) {

    var reqbody = { data:[body] };
    if (task)
        reqbody.iven_code = task ;

    axios.post(dataPath, reqbody, {
        baseURL: this.hostname,
        headers: {
            'API-KEY': this.apiKey
        }
    })
        .then(function (response) {
            response.data.apiKey = this.apiKey;
            if (response.data.hasOwnProperty('message') && !response.data.hasOwnProperty('description')) {
                response.data.description = response.data.message;
                delete response.data.message;
            }
            callback(null, response.data);
        }.bind(this))
        .catch(function (error) {
            if (error.response.status < 500) {
                var ivenCode = error.response.data.ivenCode;
                if (ivenCode == 1004 && renewApikey) {
                    this.activate(function(err, res) {
                        if (!err)
                            sendDataRequest.call(this, host, apiKey, body, false, task, callback);
                        else
                            callback(err,res);
                    }.bind(this));
                } else {
                    callback(new Error(error.response.data.description), error.response.data);
                }
            } else {
                callback(new Error("HTTP Status 500"), null);
            }
        });
};

Ivencloud.prototype.api = Ivencloud.prototype.activate;

var activationPath = "/activate/device";
var dataPath = "/data";
var generateBaseURL = function (url) {
    return "http://"+ url;
};

/**
 * Callback after an request is made to cloud.
 * @callback Ivencloud~callback
 * @param {(Object|null)}      err - return error object in case of error, else null.
 * @param {(Object|undefined)} res - response from the cloud or nothing in case of error.
 * @param {number} res.ivenCode - iven code
 * @param {string} res.apiKey - api key of the device
 */

module.exports = new Ivencloud();

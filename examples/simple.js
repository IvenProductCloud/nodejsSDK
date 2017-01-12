/**
 * @file A simple example of usage
 */

var ivencloud = require('ivencloud');

var secretKey = "your secret key"; // can be found on Hardware Profile
var deviceUid = "your device uid"; // can be found on devices

// example data format
var data =
	{
		key1: 123,     // the keys correspond to the keys on the Hardware Profile
		key2: "string"
	};

ivencloud.setCredentials(
    {
        deviceUid: secretKey,
        secretKey: deviceUid
    });

ivencloud.sendData(data, function(err, res) {
    if (err)
        console.log(err);
    else
        console.log(res);
});

ivencloud.getTasks(function(err, res) {
    if (err)
        console.log(err);
    else {
        console.log(res);
        ivencloud.taskDone(res.taskCode);
    }
});

/**
 * Created by berkozdilek on 17/06/16.
 *
 * A simple example to connect Iven Cloud
 */

var ivencloud = require('ivencloud');

var sk = "your secret key"; // can be found on Hardware Profile
var di = "your device uid"; // can be found on devices

// example data
var data = {
	key1: 123, // the keys corresbond to the keys on the Hardware Profile
	key2: "string"
};

// activate
ivencloud.activate(di, sk, function (response) {
    console.log(response);

    // send data
    ivencloud.sendData(data, function (response) {
        console.log(response);
    });
});





/**
 * Created by berkozdilek on 17/06/16.
 *
 * A simple example to connect Iven Cloud
 */

var ivencloud = require('ivencloud');

var sk = "your secret key";
var di = "your device id";

// example data
var data = {
	key1: 123,
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





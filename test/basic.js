/**
 * Created by berkozdilek on 17/06/16.
 */

var ivencloud = require('../index');

// var ivencloud = new ivencloudx();
var sk = "b2a56b8821eebad4663a22ced9ab4e558f2ac8bc";
var di = "test123";

ivencloud.activate(di, sk, function (response) {
    console.log(response);
    // console.log("apik " + ivencloud.apiKey);
    var data = {num:23, str: "this is nodejs"};
    ivencloud.sendData(data, function (response) {
        console.log(response);
    });
});




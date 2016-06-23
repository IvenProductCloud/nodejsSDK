/**
 * Created by berkozdilek on 17/06/16.
 */

var ivencloud = require('../index');

var sk = "b2a56b8821eebad4663a22ced9ab4e558f2ac8bc";
var di = "test123";
var data = {num:23, str: "this is nodejs"};

ivencloud.activate(22, sk, function (response) {
    console.log(response);
    
    ivencloud.sendData(data, function (response) {
        console.log(response);
    });
    
    // ivencloud.senDataWithLoop(data, 3, function (response) {
    //     console.log(response);
    // });
});





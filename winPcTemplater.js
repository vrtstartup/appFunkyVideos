//var Firebase = require('firebase');
//
//var firebaseRef = new Firebase("https://vrtnieuwshub.firebaseio.com");
//
//firebaseRef.on("value", function(snapshot) {
//    console.log(snapshot.val());
//}, function (errorObject) {
//    console.log("The read failed: " + errorObject.code);
//});

var querystring = require('querystring');
var http = require('http');

var id = '';

if (process.argv[2]) {
    id = process.argv[2];
}

var data = querystring.stringify({
    username: 'test',
    password: 'more testing'
});

var options = {
    host: 'nieuwshub-dev.vrt.be',
    port: '80',
    path: '/api/movie/render-movie',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(data)
    }
};

var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log("body: " + chunk);
    });
});

req.write(data);
req.end();
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
var winston = require('winston');
var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)(),
        new(winston.transports.File)({filename: '/var/log/logF.log'})
    ]
});
var lodash = require('lodash');
var fs = require('fs');

var id = '';
var movieId = '';
var last = false;

if (process.argv[2]) {
    id = process.argv[2];
    logger.info('id', id);
}

if (process.argv[3]) {
    movieId = process.argv[3];
    logger.info('id', movieId);
}

if (process.argv[9]) {
    last = process.argv[9];
    logger.info('id', last);
}

//delete rendered clip from JSON
var jsonFile = 'http://nieuwshub-dev.vrt.be/json/templater.json';
file = fs.readFileSync(jsonFile, 'utf8');

if (file.length > 0) {
    file = JSON.parse(file);

    lodash.reject(file, function(clip) {
        return clip.id === id;
    });

    fs.writeFile(jsonFile, JSON.stringify(file), (err) => {
        if(err) {
            console.log('failed to write file');
        }

        fs.chmod(jsonFile, 511);

        console.log('updated templater.json');
        res.send();
    });
}

if (last) {
    var data = querystring.stringify({
        movieId: movieId,
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
}
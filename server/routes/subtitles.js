var express = require('express');
var router = express.Router();
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var findRemoveSync = require('find-remove');
var mkdirp = require('mkdirp');

//url /api



router.post('/subtitleVideos', function(req, res, next) {
    createPath();

    var files = fs.readdirSync('temp/').length;
    var buff = [];

    if (files < 10) {
        files = '00' + files;
    } else if (files > 9 && files < 100) {
        files = '0' + files;
    }

    var fileName = 'video' + files;
    var path = 'temp/subtitleVideos/' + fileName + '.mov';

    // // Converting blob to png & writing it to /temp
    // req.on('data', function (data) {
    //         buff.push(data);
    //     })
    //     .on('error', next)
    //     .on('end', function () {
    //         fs.writeFile(path, Buffer.concat(buff), function (err) {
    //             if (err) return next(err); // something went wrong with the fs, return 500

    //             res.status(204).send(); // success!
    //         });
    // });

});


function createPath() {
    mkdirp('temp/subtitleVideos', function(err) {

        // path was created unless there was error
        console.log('Error while creating path:', err);

    });
}

router.get('/subtitles', function(req, res) {

    res.json({ message: 'subtitles get api' }).send();
});


module.exports = router;

var express = require('express');
var router = express.Router();
var fs = require('fs');
var _ffmpeg = require('ffmpeg');
var ffmpeg = require('fluent-ffmpeg');

router.post('/images', function(req, res, next) {
    var files = fs.readdirSync('temp/').length;
    var buff = [];
    //var command = ffmpeg('temp/');
    ffmpeg('temp/img%03d.jpeg')
        .loop(5)
        .fps(25)
        .on('end', function() {
            console.log('file has been converted succesfully');
        })
        .on('error', function(err) {
            console.log('an error happened: ' + err.message);
        })
        // save to file
        .save('temp/arget.m4v');

    if (files < 10) {
        files = '00' + files;
    } else if (files > 9 && files < 100) {
        files = '0' + files;
    }

    var fileName = 'img' + files;
    var path = 'temp/' + fileName + '.jpeg';

    // Converting blob to png & writing it to /temp
    req.on('data', function (data) {
            buff.push(data);
        })
        .on('error', next)
        .on('end', function () {
            fs.writeFile(path, Buffer.concat(buff), function (err) {
                if (err) return next(err); // something went wrong with the fs, return 500

                res.status(204).send(); // success!
            });
    });

});

//url /api
router.get('/images', function(req, res) {
    res.json({ message: 'hooray! welcome to our api! 1' });
});


module.exports = router;

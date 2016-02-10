var express = require('express');
var router = express.Router();
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var findRemoveSync = require('find-remove');

router.post('/images', function(req, res, next) {
    var files = fs.readdirSync('temp/').length;
    var buff = [];

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
    // ffmpeg -i img%03d.jpeg -c:v libx264 -r 30 -pix_fmt yuv420p abc.mp4
    ffmpeg('temp/img%03d.jpeg')
        .fps(30)
        .on('end', function() {
            var result = findRemoveSync('temp', { extensions: '.jpeg' });
            console.log('File has been converted succesfully');
        })
        .on('error', function(err) {
            console.log('Error: ' + err.message);
        })
        // save to file
        .save('temp/abc.mp4');

        res.json({ url: 'temp/abc.mp4' });
});


module.exports = router;

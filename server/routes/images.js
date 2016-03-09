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

    var videoFileName = getDateTime();

    ffmpeg('temp/img%03d.jpeg')
        .fps(60)
        .on('end', function() {
            var result = findRemoveSync('temp', { extensions: '.jpeg'});
            console.log('File has been converted succesfully');
        })
        .on('error', function(err) {
            console.log('Error: ' + err.message);
        })
        // save to file
        .save('temp/videos/'+ videoFileName + '.mov');

    res.json({ video_url: 'temp/videos/'+ videoFileName + '.mov' }).send();
});

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return day + '.' + month + '.' + year + '-' + hour +  min + sec;
}


module.exports = router;

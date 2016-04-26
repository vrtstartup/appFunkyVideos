var express = require('express');
var router = express.Router();
var shortId = require('shortid');
var fs = require('fs');
var youtubedl = require('youtube-dl');

//url /api
router.get('/download', function(req, res) {
    res.json({message: 'download'}).send();
});

router.post('/download', function(req, res) {

    var video = youtubedl('https://www.youtube.com/watch?v=lGcZ8sdxKmc',
        // Optional arguments passed to youtube-dl.
        ['--format=18'],
        // Additional options can be given for calling `child_process.execFile()`.
        { cwd: __dirname });

    res.json({message: 'download post'}).send();


    // Will be called when the download starts.
    video.on('info', function(info) {
        console.log('Download started');
        console.log('filename: ' + info._filename);
        console.log('size: ' + info.size);
    });

    var filename = shortId.generate() + '.mp4';

    console.log('filename', shortId.generate());

    video.pipe(fs.createWriteStream('temp/downloads/'+filename));

});

module.exports = router;

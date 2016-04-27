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
    // check if url is valid
    var url = req.body.url;

    //var url = 'https://www.instagram.com/p/BErZzXviA_F/?taken-by=designcollector';


    if(!url) return;

    var filename = shortId.generate() + '.mp4';
    var path = 'temp/downloads/'+filename;

    var video = youtubedl(url);

    // Will be called when the download starts.
    video.on('info', function(info) {
        console.log('Download started');
        console.log('filename: ' + info._filename);
        console.log('size: ' + info.size);
    });

    video.pipe(fs.createWriteStream(path));


    video.on('end', function() {
        console.log('Download ended');
        res.json({url: path}).send();
    });

});

module.exports = router;

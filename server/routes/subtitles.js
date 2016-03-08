var express = require('express');
var router = express.Router();
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var findRemoveSync = require('find-remove');
var mkdirp = require('mkdirp');

var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty({ uploadDir: 'temp/subtitleVideos/' });

//url /api
router.get('/subtitles', function(req, res) {

    res.json({ message: 'subtitles get api' }).send();
});


router.post('/subtitleVideos', multipartyMiddleware, function(req, res, next) {

    // ffmpeg -i out.mp4 -vf subtitles=sub.srt:force_style='Fontsize=20' vide.mp4
    const path = "temp/subtitleVideos/";
    var file = req.files.file;
    var url = file.path;
    var name = (file.path).replace("temp/subtitleVideos/", '').replace('.mp4', '');
    console.log('REQ', req.body.fileName);

    // convert to mp4


    if (file.type === 'srt') {
        const srtPath = path + req.body.fileName;
        const videoPath = (req.body.fileName).replace('.srt', '.mp4');
        fs.renameSync(path + name, srtPath);

        console.log('URL video', videoPath);
        console.log('URL srt', srtPath);
        // burn subtitles
        url = path + 'gen' + videoPath;

        ffmpeg(path + videoPath)
            .outputOptions(
                '-vf subtitles=' + srtPath
            )
            .on('error', function(err, stdout, stderr) {
                console.log('Error: ', stdout);
                console.log('Error: ', err.message);
                console.log('Error: ', stderr);
            })
            .save(url);
        res.json({ url: url, name: name, subtitled: true }).send();
    } else {
        res.json({ url: url, name: name, subtitled: false }).send();
    }



});




module.exports = router;

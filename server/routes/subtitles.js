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
    var name = (file.path).replace("temp/subtitleVideos/", '').replace('.mp4', '').replace('.mov', '').replace('.avi', '').replace('.mkv', '');
    //console.log('REQ', req.files.file);

    const fName = getExtension(file.name);
    console.log('REQ', fName);


    if (fName !== 'mp4') {
        console.log('~~~My file type is', file.type);
        // convert to mp4
        // ffmpeg -i movie.mov -vcodec copy -acodec copy out.mp4
        ffmpeg(file.path)
            .videoCodec('libx264')
            .format('mp4')
            .on('error', function(err, stdout, stderr) {
                console.log('Error: ', stdout);
                console.log('Error: ', err.message);
                console.log('Error: ', stderr);
            })
            .on('end', function() {
                console.log('END of converting to mp4');
                res.json({ url: url, name: name, subtitled: false, converted: true }).send();
            })
            .save(path + name + '.mp4');
    }


    if (file.type === 'srt') {
        const srtPath = path + req.body.fileName;
        const videoPath = (req.body.fileName).replace('.srt', '.mp4');
        fs.renameSync(path + name, srtPath);

        console.log('URL video', videoPath);
        console.log('URL srt', srtPath);
        // burn subtitles
        url = path + 'gen' + videoPath;

        ffmpeg(path + videoPath)
            .on('start', function(commandLine) {
                console.log('Spawned Ffmpeg with command: ' + commandLine);
            })
            .outputOptions(
                '-vf subtitles=' + srtPath
            )
            .on('error', function(err, stdout, stderr) {
                console.log('Error: ', stdout);
                console.log('Error: ', err.message);
                console.log('Error: ', stderr);
            })
            .on('end', function() {
                res.json({ url: url, name: name, subtitled: true }).send();
            })
            .save(url);
        // send response after save
        // res.json({ url: url, name: name, subtitled: true }).send();
    } else {
        res.json({ url: url, name: name, subtitled: false }).send();
    }



});

function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}



module.exports = router;

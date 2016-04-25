var express = require('express');
var router = express.Router();
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var findRemoveSync = require('find-remove');
var exec = require('child_process').exec;

var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty({ uploadDir: 'temp/subtitleVideos/' });
var emailService = require('../services/emailService.js');



//url /api
router.get('/subtitles', function(req, res) {
    res.json({ message: 'subtitles get api' }).send();
});


router.post('/subtitleVideos', multipartyMiddleware, function(req, res, next) {

    console.log('req', req.body);

    // ffmpeg -i out.mp4 -vf subtitles=sub.srt:force_style='Fontsize=20' vide.mp4
    const path = "temp/subtitleVideos/";
    var file = req.files.file;
    var url = file.path;
    var email = req.body.email;
    var name = (file.path).replace("temp/subtitleVideos/", '').replace('.mp4', '').replace('.MP4', '').replace('.mov', '').replace('.avi', '').replace('.mkv', '');

    const ext = getExtension(file.name);

    if (file.type === 'srt') {

        console.log('This is SRT file');

        const srtPath = path + req.body.fileName;
        const videoPath = (req.body.fileName).replace('.srt', '.mp4');
        fs.renameSync(path + name, srtPath);
        var filename = 'gen' + videoPath;
        // burn subtitles
        url = path + filename;

        var ffmpegCommand = 'ffmpeg -i ' + path + videoPath +' -y -vf subtitles=' + srtPath + ':force_style="FontSize=24" -strict -2 ' + url;
        var ffmpegProcess = exec(ffmpegCommand);

        ffmpegProcess.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        ffmpegProcess.stderr.on('data', function(data) {
            console.log('stderr srt: ' + data);
        });
        ffmpegProcess.on('close', function(code) {
            if (code !== 0) {
                console.log('program exited error code:', code);
                return;
            }
            sendNotification(email, filename);
            res.json({ subtitled: true }).send();

        });

    } else if(ext === 'mov') {
        // convert .mov into .mp4
        var ffmpegCommandConversion = 'ffmpeg -i ' + url + ' -vcodec copy -acodec copy ' + path + name + '.mp4';
        ffmpegProcess = exec(ffmpegCommandConversion);

        ffmpegProcess.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        ffmpegProcess.stderr.on('data', function(data) {
            console.log('stderr mov: ' + data);
        });
        ffmpegProcess.on('close', function(code) {
            if (code !== 0) {
                console.log('program exited error code:', code);
                return;
            }
            res.json({ url: path + name + '.mp4', name: name, subtitled: false }).send();
        });
    } else {
        res.json({ url: url, name: name, subtitled: false }).send();
    }
});

function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}

function sendNotification(email, url) {

    var fullUrl = 'http://nieuwshub.vrt.be/#/download/' + url;
    var subject = 'Uw video met ondertitels is klaar om te downloaden ' + url;
    var message = "<p>Beste collega,</p><p>Uw video met ondertitels is klaar, u kan hem hier downloaden:<br /> <a href=" + fullUrl +
        ">" + fullUrl + "</a></p><p>Nog een prettige dag verder,</p><p>De Hub Server</p>";

    emailService.sendMail(email, subject, message);
}


module.exports = router;

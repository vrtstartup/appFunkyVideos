var express = require('express');
var router = express.Router();
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var findRemoveSync = require('find-remove');
var exec = require('child_process').exec;

var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty({ uploadDir: 'temp/subtitleVideos/' });
var emailService = require('../services/emailService.js');
//var nodemailer = require('nodemailer');
//var transporter = nodemailer.createTransport('smtps://vrtfunkyvideos%40gmail.com:sxB-8kc-6p4-ekF@smtp.gmail.com');


//url /api
router.get('/subtitles', function(req, res) {
    res.json({ message: 'subtitles get api' }).send();
});


router.post('/subtitleVideos', multipartyMiddleware, function(req, res, next) {

    // ffmpeg -i out.mp4 -vf subtitles=sub.srt:force_style='Fontsize=20' vide.mp4
    const path = "temp/subtitleVideos/";
    var file = req.files.file;
    var url = file.path;
    var email = req.body.email;
    var name = (file.path).replace("temp/subtitleVideos/", '').replace('.mp4', '').replace('.MP4', '').replace('.mov', '').replace('.avi', '').replace('.mkv', '');
    //console.log('REQ', req.files.file);

    //const fName = getExtension(file.name);


    //if (fName !== 'mp4' || fName !== 'srt') {
    //    console.log('~~~My file type is', file.type);
    //    // convert to mp4
    //    // ffmpeg -i movie.mov -vcodec copy -acodec copy out.mp4
    //    ffmpeg(file.path)
    //        .videoCodec('libx264')
    //        .format('mp4')
    //        .on('error', function(err, stdout, stderr) {
    //            console.log('Error: ', stdout);
    //            console.log('Error: ', err.message);
    //            console.log('Error: ', stderr);
    //        })
    //        .on('end', function() {
    //            console.log('END of converting to mp4');
    //            //res.json({ url: url, name: name, subtitled: false, converted: true }).send();
    //        })
    //        .save(path + name + '.mp4');
    //}


    if (file.type === 'srt') {
        const srtPath = path + req.body.fileName;
        const videoPath = (req.body.fileName).replace('.srt', '.mp4');
        fs.renameSync(path + name, srtPath);


        // burn subtitles
        url = path + 'gen' + videoPath;

        // ffmpeg(path + videoPath)
        //     .outputOptions([
        //         '-vf subtitles=' + srtPath + ':force_style="FontSize=40"',
        //         '-strict',
        //         '-2'
        //     ])
        //     .on('start', function(commandLine) {
        //         //findRemoveSync('temp', {age: {seconds: 36000}});
        //         res.json({ processing: true }).send();
        //         console.log('FFMPEG is really going to work hard: ' + commandLine);
        //     })
        //     .on('progress', function(progress) {
        //         console.log('FFMPEG is working SUPER hard: ' + progress.percent + '% done');
        //     })
        //     .on('error', function(err, stdout, stderr) {
        //         console.log('Error: ', stdout);
        //         console.log('Error: ', err.message);
        //         console.log('Error: ', stderr);
        //         res.json({ error: stderr }).send();
        //     })
        //     .on('end', function() {
        //         console.log('FFMPEG is DONE!', url);
        //         sendNotificationTo(email, url);
        //     })
        //     .save(url);






        var ffmpegCommand = 'ffmpeg -i ' + path + videoPath +' -y -vf subtitles=' + srtPath + ':force_style="FontSize=24" -strict -2 ' + url;
        var ffmpegProcess = exec(ffmpegCommand);

        ffmpegProcess.stdout.on('data', function(data) {

            console.log('stdout: ' + data);
        });
        ffmpegProcess.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });
        ffmpegProcess.on('close', function(code) {
            if (code !== 0) {
                console.log('program exited error code:', code);
                return;
            }
            sendNotification(email, url);
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
    var fullUrl = 'http://nieuwshub.vrt.be/' + url;
    var subject = 'Uw video met ondertitels is klaar om te downloaden (' + url + ')';
    var message = "<p>Beste collega,</p><p>Uw video met ondertitels is klaar, u kan hem hier downloaden:<br /> <a href=" + fullUrl +
        ">" + fullUrl + "</a></p><p>Nog een prettige dag verder,</p><p>De Hub Server</p>";

    emailService.sendMail(email, subject, message);
}


module.exports = router;

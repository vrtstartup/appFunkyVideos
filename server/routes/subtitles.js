var express = require('express');
var router = express.Router();
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var findRemoveSync = require('find-remove');

var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty({ uploadDir: 'temp/subtitleVideos/' });

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://user40gmail.com:pwd@smtp.gmail.com');


//url /api
router.get('/subtitles', function(req, res) {

    //transporter.sendMail(mailOptions, function(error, info){
    //    if(error){
    //        return console.log(error);
    //    }
    //    console.log('Message sent: ' + info.response);
    //});

    res.json({ message: 'subtitles get api' }).send();
});


router.post('/subtitleVideos', multipartyMiddleware, function(req, res, next) {

    // ffmpeg -i out.mp4 -vf subtitles=sub.srt:force_style='Fontsize=20' vide.mp4
    const path = "temp/subtitleVideos/";
    var file = req.files.file;
    var url = file.path;
    var email = req.body.email;
    var name = (file.path).replace("temp/subtitleVideos/", '').replace('.mp4', '').replace('.mov', '').replace('.avi', '').replace('.mkv', '');
    //console.log('REQ', req.files.file);

    const fName = getExtension(file.name);
    console.log('REQ', file);


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

        console.log('URL video', videoPath);
        console.log('URL srt', srtPath);
        // burn subtitles
        url = path + 'gen' + videoPath;

        ffmpeg(path + videoPath)
            .on('start', function(commandLine) {
                console.log('FFMPEG is really working hard: ' + commandLine);
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
                console.log('END: ', url);
                sendNotificationTo(email, url);
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

function sendNotificationTo(email, url) {

    var fullUrl = 'https://cryptic-everglades-93518.herokuapp.com/' + url;

    var mailOptions = {
        from: '"Fred Foo 👥" <foo@blurdybloop.com>', // sender address
        to: email, // list of receivers
        subject: 'VRT: Jouw video met subtitles is klaar', // Subject line
        text: 'Jouw video met subtitles is klaar! Je kan hem: ', // plaintext body
        html: '<a href='+ fullUrl+'>downloaden</a>' // html body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}


module.exports = router;

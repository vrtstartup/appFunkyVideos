var express = require('express');
var router = express.Router();
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var findRemoveSync = require('find-remove');

var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty({ uploadDir: 'temp/subtitleVideos/' });

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://vrtfunkyvideos%40gmail.com:sxB-8kc-6p4-ekF@smtp.gmail.com');


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
    var name = (file.path).replace("temp/subtitleVideos/", '').replace('.mp4', '').replace('.mov', '').replace('.avi', '').replace('.mkv', '');
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

        ffmpeg(path + videoPath)
            .inputOptions(
                '-strict -2'
            )
            .on('start', function(commandLine) {
                findRemoveSync('temp', {age: {seconds: 36000}});
                console.log('FFMPEG is really working hard: ' + commandLine);
            })
            .outputOptions(
                '-vf subtitles=' + srtPath
            )
            .on('error', function(err, stdout, stderr) {
                console.log('Error: ', stdout);
                console.log('Error: ', err.message);
                console.log('Error: ', stderr);
                res.json({ error: stderr }).send();
            })
            .on('end', function() {
                console.log('END: ', url);
                findRemoveSync('temp', {files: videoPath});
                sendNotificationTo(email, url);
                res.json({ url: url, name: name, subtitled: true }).send();
            })
            .save(url);

    } else {
        res.json({ url: url, name: name, subtitled: false }).send();
    }



});

function getExtension(filename) {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}

function sendNotificationTo(email, url) {
    console.log('sending message to:', email, 'with url:', url);
    var fullUrl = 'http://nieuwshub.vrt.be/' + url;

    var mailOptions = {
        from: '"VRT funky videos👥" <vrtfunkyvideos@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'VRT: Jouw video met subtitles is klaar', // Subject line
        html: '<p>Je kan hem hier <a href='+ fullUrl+'>downloaden</a></p><br/><p>Deze video wordt na 10u verwijderd</p>' // html body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}


module.exports = router;

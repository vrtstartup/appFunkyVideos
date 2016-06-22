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
    const path = "temp/subtitleVideos/";
    var file = req.files.file;
    var url = file.path;
    var email = req.body.email;
    console.log(req.body);
    var name = (file.path).replace("temp/subtitleVideos/", '').replace('.mp4', '').replace('.MP4', '').replace('.mov', '').replace('.avi', '').replace('.mkv', '');

    // const ext = getExtension(file.name);
    if (file.type === 'ass') {
        const srtPath = path + req.body.fileName;
        const videoPath = (req.body.fileName).replace('.srt', '.mp4');
        fs.renameSync(path + name, srtPath);
        var filename = 'gen' + videoPath;
        // burn subtitles
        url = path + videoPath;
        res.json({ url: url, name: videoPath}).send();
    } else {
        res.json({ url: url, name: videoPath, subtitled: false }).send();
    }
});

// function getExtension(filename) {
//     var parts = filename.split('.');
//     return parts[parts.length - 1];
// }

function sendNotification(email, url) {

    var fullUrl = 'http://nieuwshub.vrt.be/#/download/' + url;
    var subject = 'Uw video met ondertitels is klaar om te downloaden ' + url;
    var message = "<p>Beste collega,</p><p>Uw video met ondertitels is klaar, u kan hem hier downloaden:<br /> <a href=" + fullUrl +
        ">" + fullUrl + "</a></p><p>Nog een prettige dag verder,</p><p>De Hub Server</p>";

    emailService.sendMail(email, subject, message);
}


module.exports = router;

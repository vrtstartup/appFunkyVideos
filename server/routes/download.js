var express = require('express');
var router = express.Router();
var shortId = require('shortid');
var fs = require('fs');
var youtubedl = require('youtube-dl');
var emailService = require('../services/emailService.js');

//
//url /api
router.get('/download', function(req, res) {
    res.json({ message: 'download' }).send();
});

router.post('/download', function(req, res) {
    var url = req.body.url;
    var email = req.body.email;

    if (!url) return;

    var filename = shortId.generate() + '.mp4';
    var path = 'temp/downloads/' + filename;

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
        sendNotification(email, filename);
        res.json({ url: path }).send();
    });

});


function sendNotification(email, url) {

    var fullUrl = 'http://nieuwshub.vrt.be/#/download/' + url;
    var subject = 'Uw video met ondertitels is klaar om te downloaden ' + url;
    var message = "<p>Beste collega,</p><p>Uw video kan je hier downloaden:<br /> <a href=" + fullUrl +
        ">" + fullUrl + "</a></p><p>Nog een prettige dag verder,</p><p>De Hub Server</p>";

    emailService.sendMail(email, subject, message);
}

module.exports = router;
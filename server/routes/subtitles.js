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
    //createPath();

    var file = req.files.file;

    console.log(file.name);
    console.log(file.type);

    var url = req.files.file.path;
    console.log('REQ', req.files.file.path);

    res.json({ url: url }).send();

});




function createPath() {
    mkdirp('temp/subtitleVideos', function(err) {

        // path was created unless there was error
        console.log('Error while creating path:', err);

    });
}


module.exports = router;

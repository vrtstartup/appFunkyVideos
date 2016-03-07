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

    var file = req.files.file;

    console.log(file.name);
    console.log(file.type);

    var url = file.path;
    var name = (file.path).replace("temp/subtitleVideos/", '').replace('.mov', '');

    console.log('REQ', file);

    res.json({ url: url, name: name }).send();

});




module.exports = router;

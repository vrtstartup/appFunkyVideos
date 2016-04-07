var express = require('express');
var router = express.Router();
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var multiparty = require('connect-multiparty');
var uploadDir = 'temp/movies/';
var multipartyMiddleware = multiparty({ uploadDir: uploadDir });

var dropboxService = require('../services/dropboxService.js');
var dbClient = dropboxService.getDropboxClient();

//url /api/movie

router.post('/movie-clip', multipartyMiddleware, function(req, res, next) {
    //save clip to local disk in folder with movie ID ((refactor multiParty shizzle))
    console.log(req.files.file);
    var clipName = req.files.file.path.replace(uploadDir, '');
    console.log(clipName);
    res.send();
});

router.post('/render-movie', function(req, res, next) {
   //stitch together movie by folder ID, put result in download folder, delete all temp files
});

module.exports = router;

var express = require('express');
var router = express.Router();
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var multiparty = require('multiparty');

var dropboxService = require('../services/dropboxService.js');
var dbClient = dropboxService.getDropboxClient();

//url /api/movie

router.post('/movie-clip', function(req, res, next) {
    var form = new multiparty.Form();
    form.parse(req);

    var fileStream = '';
    var firstPart = true;
    var fileName = '';
    var folderName = '';
    var uploadPath = 'temp/movies/';

    form.on('error', function(err) {
        console.log('Error parsing form: ' + err.stack);
    });

    form.on('part', function(part) {
        part.on('data', function(data) {
            if (!part.filename) {
                if (part.name === "movieId") folderName = data.toString();
                if (part.name === "clipId") fileName = data.toString();
            }
            else {
                if(firstPart) {
                    firstPart = false;
                    var fullPath = uploadPath + folderName + '/' + fileName + '.mp4';
                    fileStream = fs.createWriteStream(fullPath, {'flags': 'a'});
                }

                fileStream.write(data);
            }
        });

        part.on('error', function(err) {
            console.log(err);
        });

        part.resume();
    });

    form.on('close', function() {
        console.log('file saved');
    });
});

router.post('/render-movie', function(req, res, next) {
   //stitch together movie by folder ID, put result in download folder, delete all temp files
});

module.exports = router;

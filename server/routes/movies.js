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
    var fileStreamOpened = false;
    var fileName = '';
    var folderName = '';
    var uploadPath = 'temp/movies/';
    var fullPath = '';

    form.on('part', function(part) {
        part.on('data', function(data) {
            if (!part.filename) {
                if (part.name === "movieId") folderName = data.toString();
                if (part.name === "clipId") fileName = data.toString();
            }
            else {
                if (!fileStreamOpened) {
                    fileStreamOpened = true;
                    fullPath = uploadPath + folderName + '/' + fileName + '.mp4';

                    if (!fs.existsSync(uploadPath + folderName)){
                        fs.mkdirSync(uploadPath + folderName);
                    }

                    fileStream = fs.createWriteStream(fullPath, {'flags': 'a'});
                }

                fileStream.write(data);
            }
        });

        part.on('error', function(err) {
            console.log('part error', err);
            return next(Boom.badImplementation('file upload failed!'));
        });

        part.resume();
    });

    form.on('error', function(err) {
        console.log('upload error', err);
        return next(Boom.badImplementation('file upload failed!'));
    });

    form.on('close', function() {
        res.json({filePath: fullPath, fileName: fileName + '.mp4'}).send();
    });
});

router.post('/render-movie', function(req, res, next) {
   //stitch together movie by folder ID, put result in download folder, delete all temp files
});

module.exports = router;

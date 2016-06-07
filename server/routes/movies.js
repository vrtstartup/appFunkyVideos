var express = require('express');
var router = express.Router();
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var multiparty = require('multiparty');

var Boom = require('boom');
var dropboxService = require('../services/dropboxService.js');
var dbClient = dropboxService.getDropboxClient();

//url /api/movie
router.post('/upload-to-dropbox', function(req, res, next) {
    //handle file with multer - read file to convert into binary - save file to dropbox
    var form = new multiparty.Form();

    form.parse(req);

    //if form contains file, open fileStream to get binary file
    form.on('file', function(name, file) {

        fs.readFile(file.path, function(err, data) {
            var imageUrl = '';
            var fileName = file.originalFilename.replace(/(?:\.([^.]+))?$/, '');

            if(!dbClient) {
                console.log('No dbClient');
            }else {

                dbClient.writeFile('in/' + file.originalFilename, data, function(error, stat) {
                    if (error) {
                        console.log('ERROR:', error);
                        return next(Boom.badImplementation('unexpected error, couldn\'t upload file to dropbox'));
                    }

                    var fileUrl = 'in/' + file.originalFilename;
                    dbClient.makeUrl(fileUrl, {downloadHack: true}, function(error, data) {
                        imageUrl = data.url;
                        console.log(error);

                        var width;
                        var height;
                        ffmpeg.ffprobe(imageUrl, function(err, metadata) {
                            // console.log(metadata);
                            // console.log(metadata.streams);
                            // console.log(metadata.streams[0]);
                            // console.log(metadata.streams[0].width, metadata.streams[0].height);
                            // width  = metadata.streams[0].width;
                            // height = metadata.streams[0].height;


                            res.json({
                                image: imageUrl,
                                // width: width,
                                // height: height,
                                filenameOut: file.originalFilename.replace(/(?:\.([^.]+))?$/, ''),
                                filenameIn: file.originalFilename
                            }).send();

                        });
                    });
                });
            }
        });
    });
});

router.post('/update-movie-json', function(req, res, next) {
    var movieClips = req.body.movieClips;

    //update dropbox json
    var file = {
        path: '/json/',
        name: 'templater.json',
        data: ''
    };

    //update JSON file on dropbox so AE templater get's triggered
    dbClient.readFile(file.path + file.name, function(error, data) {
        if (error) {
            return next(Boom.badImplementation('unexpected error, couldn\'t read file from dropbox'));
        }

console.log(data);
        file.data = data ? JSON.parse(data) : [];


        movieClips.forEach(function(clip) {

            file.data.push(clip);
        });

        dbClient.writeFile(file.path + file.name, JSON.stringify(file.data), function(error, stat) {
            if (error) {
                return next(Boom.badImplementation('unexpected error, couldn\'t upload file to dropbox'));
            }

            res.send();
        });
    });
});

module.exports = router;

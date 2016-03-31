var express = require('express');
var include = require('include');
var router = express.Router();
var Boom = require('boom');
var Dropbox = require('dropbox');
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var multiparty = require('multiparty');
var Q = require('q');
var dropboxService = require('../services/dropboxService.js');

var dbClient = dropboxService.getDropboxClient();

//url /api
router.post('/templaterVideo', function(req, res, next) {
    //handle file with multer - read file to convert into binary - save file to dropbox
    var form = new multiparty.Form();

    form.parse(req);

    //if form contains file, open fileStream to get binary file
    form.on('file', function(name, file) {
        fs.readFile(file.path, function(err, data) {
            //write binary fileStream to DB /in folder
            console.log(data);
            dbClient.writeFile('in/' + file.originalFilename, data, function(error, stat) {
                if (error) {
                    return next(Boom.badImplementation('unexpected error, couldn\'t upload file to dropbox'));
                }

                res.json({
                    filenameOut: file.originalFilename.replace(/(?:\.([^.]+))?$/, ''),
                    filenameIn: file.originalFilename
                }).send();
            });
        });
    });
});

router.post('/templaterRender', function(req, res, next) {
    var fileName = req.body.fileName;
    console.log('received a render for:', fileName);

    //transfer both files to temp
    function promiseIn() {
        var deferred = Q.defer();

        dbClient.readFile('in/' + fileName, {buffer: true}, function(error, data) {
            if (error) {
                return next(Boom.badImplementation('unexpected error, couldn\'t open file from dropbox'));
            }

            fs.writeFile('temp/templater/in' + fileName, data, function(err) {
                if (err) deferred.reject(new Error(err));
                else deferred.resolve(data);
            });
        });

        return deferred.promise;
    };

    function promiseOut() {
        var deferred = Q.defer();

        dbClient.readFile('out/' + fileName, {buffer: true}, function(error, data) {
            if (error) {
                return next(Boom.badImplementation('unexpected error, couldn\'t open file from dropbox'));
            }

            fs.writeFile('temp/templater/out' + fileName, data, function(err) {
                if (err) deferred.reject(new Error(err));
                else deferred.resolve(data);
            });
        });

        return deferred.promise;
    };

    Q.all([promiseIn(), promiseOut()])
        .then((values)=> {
            //#TODO trigger FFMPEG render
            console.log('File 1:', values[0]);
            console.log('File 2:', values[1]);
        })
        .catch((err) => {
            console.log('failed to get both files:', err);
        });

    //#TODO do some render magic, add bumper and save to server

    //var fluent_ffmpeg = require("fluent-ffmpeg");
    //
    //var mergedVideo = fluent_ffmpeg();
    //var videoNames = ['./video1.mp4', './video2.mp4'];
    //
    //videoNames.forEach(function(videoName){
    //    mergedVideo = mergedVideo.addInput(videoName);
    //});
    //
    //mergedVideo.mergeToFile('./mergedVideo.mp4', './tmp/')
    //    .on('error', function(err) {
    //        console.log('Error ' + err.message);
    //    })
    //    .on('end', function() {
    //        console.log('Finished!');
    //    });

    //#TODO refactor mail to service

    //#TODO send mail with completed file
});

module.exports = router;

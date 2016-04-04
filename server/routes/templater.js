var express = require('express');
var router = express.Router();
var Boom = require('boom');
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var multiparty = require('multiparty');
var Q = require('q');
var spawn = require('child_process').spawn;
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

    var inFile = 'in/' + fileName + '.mp4';
    var outFile = 'out/' + fileName + '.mov';
    var templaterFolder = 'temp/templater/';

    //transfer both files to temp
    //#todo: refactor dropbox file transfer to service
    function promiseIn() {
        var deferred = Q.defer();

        dbClient.readFile(inFile, {buffer: true}, function(error, data) {
            if (error) {
                return next(Boom.badImplementation('unexpected error, couldn\'t open file from dropbox'));
            }

            fs.writeFile(templaterFolder + 'in' + fileName + '.mp4', data, function(err) {
                if (err) deferred.reject(new Error(err));
                else deferred.resolve(templaterFolder + 'in' + fileName + '.mp4');
            });
        });

        return deferred.promise;
    };

    function promiseOut() {
        var deferred = Q.defer();

        dbClient.readFile(outFile, {buffer: true}, function(error, data) {
            if (error) {
                return next(Boom.badImplementation('unexpected error, couldn\'t open file from dropbox'));
            }

            fs.writeFile(templaterFolder + 'out' + fileName + '.mov', data, function(err) {
                if (err) deferred.reject(new Error(err));
                else deferred.resolve(templaterFolder + 'out' + fileName + '.mov');
            });
        });

        return deferred.promise;
    };

    Q.all([promiseIn(), promiseOut()])
        .then((values)=> {
            //#TODO trigger FFMPEG render
            console.log('File 1:', values[0]);
            console.log('File 2:', values[1]);

            var filePathIn = values[0];
            var filePathOut = values[1];
            var filePathBumper = 'server/assets/bumper.mov';
            var outPath = 'temp/templater/' + 'gentemp' + fileName + '.mp4';

            //#todo set video length
            var ffmpegCommand = "ffmpeg -i " + filePathIn +
                " -i " + filePathOut +
                " -itsoffset 00:00:28.000 -i " + filePathBumper +
                " -filter_complex 'nullsrc=size=720x480 [base];" +
                "[0:v] scale=720x480 [bottom];" +
                "[1:v] scale=720x480 [top];" +
                "[2:v] scale=720x480 [bumper];" +
                "[base][bottom] overlay=eof_action=pass [tmp1];" +
                "[tmp1][top] overlay=eof_action=pass [tmp2];" +
                "[tmp2][bumper] overlay=eof_action=endall' " + outPath;

            exec(ffmpegCommand, function(err, stdout, stderr) {
                console.log('err', err);
                console.log('stdout', stdout);
                console.log('stderr', stderr);
            });

            //ffmpeg()
            //    .input(filePathIn)
            //    .input(filePathOut)
            //    .inputOptions('-itsoffset 00:00:28.000')
            //    .input(filePathBumper)
            //    .outputOptions('-filter_complex "nullsrc=size=720x480 [base];[0:v] scale=720x480 [bottom];[1:v] scale=720x480 [top];[2:v] scale=720x480 [bumper];[base][bottom] overlay=eof_action=pass [tmp1];[tmp1][top] overlay=eof_action=pass [tmp2];[tmp2][bumper] overlay=eof_action=endall"')
            //    .output(outPath)
            //    .run()
            //    .on('start', function(command) {
            //       console.log('starting FFMPEG:', command);
            //    })
            //    .on('progress', function(progress) {
            //        console.log('FFMPEG is working SUPERDUPER hard:', progress.percent, ' % done');
            //    })
            //    .on('end', function() {
            //        console.log('Done rendering!');
            //    })
            //    .on('error', function(err) {
            //        console.log('an error happened: ' + err);
            //    });
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

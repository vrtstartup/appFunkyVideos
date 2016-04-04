var express = require('express');
var router = express.Router();
var Boom = require('boom');
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var multiparty = require('multiparty');
var Q = require('q');
var exec = require('child_process').exec;
var Metalib = require('fluent-ffmpeg').Metadata;
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
                else {
                    ffmpeg.ffprobe(templaterFolder + 'in' + fileName + '.mp4', function(err, metadata) {
                        deferred.resolve({filePath: templaterFolder + 'in' + fileName + '.mp4', bumperDelay: metadata.format.duration - 2});
                    });
                }
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
            console.log('Saved both files ' + values[0] + ', ' + values[1] + '. Starting FFMPEG.');

            var filePathIn = values[0].filePath;
            var bumperDelay = values[0].bumperDelay;
            var filePathOut = values[1];
            var filePathBumper = 'server/assets/bumper.mov';
            var outPath = 'temp/templater/' + 'gentemp' + fileName + '.mp4';

            var ffmpegCommand = "ffmpeg -i " + filePathIn +
                " -i " + filePathOut +
                " -itsoffset " + bumperDelay + " -i " + filePathBumper +
                " -filter_complex 'nullsrc=size=720x480 [base];" +
                "[0:v] scale=720x480 [bottom];" +
                "[1:v] scale=720x480 [top];" +
                "[2:v] scale=720x480 [bumper];" +
                "[base][bottom] overlay=eof_action=pass [tmp1];" +
                "[tmp1][top] overlay=eof_action=pass [tmp2];" +
                "[tmp2][bumper] overlay=eof_action=endall' -y " + outPath;

            var ffmpegProcess = exec(ffmpegCommand);

            ffmpegProcess.stdout.on('data', function(data) {
                console.log('stdout: ' + data);
            });
            ffmpegProcess.stderr.on('data', function(data) {
                console.log('stdout: ' + data);
            });
            ffmpegProcess.on('close', function(code) {
                console.log('program exited with code:', code);
            });
        })
        .catch((err) => {
            console.log('failed to get both files:', err);
        });

    //#TODO refactor mail to service

    //#TODO send mail with completed file
});

module.exports = router;

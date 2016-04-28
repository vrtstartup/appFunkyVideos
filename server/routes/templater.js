var express = require('express');
var router = express.Router();
var Boom = require('boom');
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var multiparty = require('multiparty');
var Q = require('q');
var exec = require('child_process').exec;
var dropboxService = require('../services/dropboxService.js');

var dbClient = dropboxService.getDropboxClient();
var emailService = require('../services/emailService.js');

// api/templater/upload
router.post('/upload', function(req, res, next) {
    //handle file with multer - read file to convert into binary - save file to dropbox
    var form = new multiparty.Form();

    form.parse(req);

    //if form contains file, open fileStream to get binary file
    form.on('file', function(name, file) {
        fs.readFile(file.path, function(err, data) {
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

// api/templater/render
router.post('/render', function(req, res, next) {
    var fileName = req.body.fileName;

    console.log('received a render for:', fileName);

    var inFile = 'in/' + fileName + '.mp4';
    var outFile = 'out/' + fileName + '.mov';
    var templaterFolder = 'temp/templater/';

    res.json({message: 'request has been added to queue, your video will start rendering'}).send();

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
            console.log('saved both files, starting FFMPEG.');

            var filePathIn = values[0].filePath;
            var bumperDelay = values[0].bumperDelay;
            var filePathOut = values[1];
            var filePathBumper = 'server/assets/bumper.mov';
            var outPath = 'temp/templater/' + 'gentemp' + fileName + '.mp4';

            var ffmpegCommand = "ffmpeg -loglevel info -nostats -i " + filePathIn +
                " -i " + filePathOut +
                " -itsoffset " + bumperDelay + " -i " + filePathBumper +
                " -filter_complex 'nullsrc=size=720x480 [base];" +
                "[0:v] scale=720x480 [bottom];" +
                "[1:v] scale=720x480 [top];" +
                "[2:v] scale=720x480 [bumper];" +
                "[base][bottom] overlay=eof_action=pass [tmp1];" +
                "[tmp1][top] overlay=eof_action=pass [tmp2];" +
                "[tmp2][bumper] overlay=eof_action=endall' -y " + outPath;


            console.log('running:', ffmpegCommand);

            var ffmpegProcess = exec(ffmpegCommand);

            ffmpegProcess.stdout.on('data', function(data) {
                console.log('stdout: ' + data);
            });
            ffmpegProcess.stderr.on('data', function(data) {
                console.log('stderr: ' + data);
            });
            ffmpegProcess.on('close', function(code) {
                if(code !== 0) {
                    console.log('program exited error code:', code);
                    return;
                }

                sendNotification('kusksu@gmail.com', outPath);
            });
        })
        .catch((err) => {
            console.log('Failed to get files from dropbox or failed to write them to local disk', err);
        });

    //#TODO refactor mail to service

    //#TODO send mail with completed file
    function sendNotification(toAddress, url) {
        var subject = "Uw video met tekst is klaar om te downloaden";
        var fullUrl = 'http://nieuwshub.vrt.be/' + url;
        var message = "<p>Beste collega,</p><p>Uw video met tekst is klaar, u kan hem hier downloaden:<br /> <a href=" + fullUrl +
            ">" + fullUrl + "</a></p><p>Nog een prettige dag verder,</p><p>De Hub Server</p>";

        emailService.sendMail(toAddress, subject, message);
    }
});

// api/templater/
//router.post('/', function(req, res, next) {
    //update firebase with request body

    //open json file from dropbox
    //var file = {
    //    path: '/json/',
    //    name: 'templater.json',
    //    data: ''
    //};

    ////update JSON file on dropbox so AE templater get's triggered
    //dbClient.readFile(file.path + file.name, function(error, data) {
    //    if (error) {
    //        return next(Boom.badImplementation('unexpected error, couldn\'t read file from dropbox'));
    //    }
    //
    //    file.data = JSON.parse(data);
    //    var objToAdd = req.body;
    //
    //    file.data.push(objToAdd);
    //
    //    dbClient.writeFile(file.path + file.name, JSON.stringify(file.data), function(error, stat) {
    //        if (error) {
    //            return next(Boom.badImplementation('unexpected error, couldn\'t upload file to dropbox'));
    //        }
    //
    //        res.send();
    //    });
    //});
//});

module.exports = router;

var express = require('express');
var router = express.Router();
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var multiparty = require('multiparty');
var connectMultiparty = require('connect-multiparty');
var multipartyMiddleware = connectMultiparty({ uploadDir: 'temp/subtitleVideos/' });
var exec = require('child_process').exec;
var firebase = require("firebase");
var Boom = require('boom');
var dropboxService = require('../services/dropboxService.js');
var dbClient = dropboxService.getDropboxClient();

// var firebase = require('firebase');
// var firebaseService = require('../services/firebaseService.js');


// var logger = require('../middleware/logger');


var emailService = require('../services/emailService.js');

function time() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    var date = yyyy + mm + dd + '_' + hours + minutes + seconds;
    return date;
}

function sendNotification(email, status, url) {
    if (status === 'finished') {
        var subject = 'Je video met ondertitels is klaar om te downloaden!';
        var message = "<p>Beste collega,</p><p>Je video met ondertitels is klaar, je kan hem hier downloaden:<br /> <a href=" + url +
            ">" + url + "</a></p><p>Nog een prettige dag verder,</p><p>De Hub Server</p>";
        emailService.sendMail(email, subject, message);
    } else if (status === 'error') {
        var subject = 'Er is iets fout gelopen bij het ondertitelen van je video!';
        var message = "<p>Beste collega,</p><p>Er liep jammergenoeg niets fout bij het ondertitelen van je video.<br /></p>" +
            "<p>Je neemt best contact op met de Nieuwshub, of mail naar maarten.lauwaert@vrt.be.</p>" + "<p>Onze excuses voor het ongemak!";
        emailService.sendMail(email, subject, message);
    }
}

function sendResultToDropbox(video, videoName, ass, email) {
    fs.readFile(video, function(err, data) {
        if (!dbClient) {
            console.log('No dbClient');
        } else {
            dbClient.writeFile('subtitled/' + videoName, data, function(error, stat) {
                console.log('stat', stat);
                if (error) {
                    console.log('ERROR:', error);
                    return next(Boom.badImplementation('unexpected error, couldn\'t upload file to dropbox'));
                    sendNotification(email, 'error', '');
                }
                var fileUrl = 'subtitled/' + videoName;
                dbClient.makeUrl(fileUrl, { downloadHack: true }, function(error, data) {
                    sendNotification(email, 'finished', data.url);
                    // Delete the tempVideo and the ass-File
                    fs.unlinkSync(video);
                    fs.unlinkSync(ass);
                });
            });
        }
    });
}

// 0: Project started
// 1: uploaded video
// 2: started



//url /api/movie
router.post('/upload-to-dropbox', function(req, res, next) {

    var log = req.query.logs;
    var db = firebase.database().ref('logs/' + log + '/status/startedOriginalVideoUpload').set(true).catch(function(error) {
        console.log('Failed to save to log', error);
    });





    var form = new multiparty.Form();

    // console.log('project', req);
    form.parse(req);
    // console.log('project', req);
    //if form contains file, open fileStream to get binary file
    form.on('file', function(name, file) {
        fs.readFile(file.path, function(err, data) {
            var imageUrl = '';
            var fileName = file.originalFilename.replace(/(?:\.([^.]+))?$/, '');

            if (!dbClient) {
                console.log('No dbClient');

            } else {
                dbClient.writeFile('in/' + file.originalFilename, data, function(error, stat) {
                    if (error) {

                        console.log('ERROR:', error);
                        return next(Boom.badImplementation('unexpected error, couldn\'t upload file to dropbox'));
                    }
                    var fileUrl = 'in/' + file.originalFilename;
                    dbClient.makeUrl(fileUrl, { downloadHack: true }, function(error, data) {
                        imageUrl = data.url;

                        ffmpeg.ffprobe(imageUrl, function(err, metadata) {
                            if (metadata) {
                                for (i = 0; i < metadata.streams.length; i++) {
                                    if (metadata.streams[i].codec_type === 'video') {
                                        width = metadata.streams[i].width;
                                        height = metadata.streams[i].height;
                                        res.json({
                                            image: imageUrl,
                                            width: metadata.streams[i].width,
                                            height: metadata.streams[i].height,
                                            filenameOut: file.originalFilename.replace(/(?:\.([^.]+))?$/, ''),
                                            filenameIn: file.originalFilename
                                        }).send();

                                    }
                                }
                            } else {
                                res.json({
                                    image: imageUrl,
                                    filenameOut: file.originalFilename.replace(/(?:\.([^.]+))?$/, ''),
                                    filenameIn: file.originalFilename
                                }).send();
                            }
                        });
                    });
                });
            }
        });
    });
});

router.post('/generateSub', multipartyMiddleware, function(req, res, next) {

    // logger.info('generating sub');
    // logger.trace('testing');
    // logger.info('testing');
    // logger.warn('testing');
    // logger.crit('testing');
    // logger.fatal('testing');

    const path = "temp/subtitleVideos/";
    var file = req.files.file;
    var url = file.path;
    var email = req.body.email;
    var name = (file.path).replace("temp/subtitleVideos/", '');

    if (file.type === 'ass') {
        const srtPath = path + req.body.fileName;
        const videoPath = (req.body.fileName).replace('.srt', '.mp4');
        fs.renameSync(path + name, srtPath);
        var filename = 'gen' + videoPath;
        // burn subtitles
        url = path + videoPath;
        res.json({ url: url, name: videoPath }).send();
        // logger.info('done generating sub');
    } else {
        // logger.fatal('error generating subs');
        res.json({ url: url, name: videoPath, subtitled: false }).send();
    }
});



router.post('/burnSubs', function(req, res) {
    // logger.info('burning Subs');
    const path = "temp/subtitleVideos/";
    var ass = req.body.ass;
    var movie = req.body.movie;
    var email = req.body.email;
    var logo = req.body.logo;
    var audio = req.body.audio;
    var bumper = req.body.bumper;
    var duration = req.body.duration;
    var fade = req.body.fade;
    var width = req.body.width;
    var height = req.body.height;
    var log = req.body.log;
    var bumperLength = req.body.bumperLength;
    var videoName = time() + '_' + (email.substring(0, email.indexOf("@"))).replace('.', '') + '.mp4';
    var tempVideo = path + videoName;


    var ffmpegCommand = '';
    var complexFilter = [];

    if (bumper !== false && logo !== false) {




        ffmpegCommand = ffmpeg()
            .input(movie)
            .input(bumper)
            .input(logo)
            .input('color=c=black').inputOptions('-f lavfi');
        complexFilter = [
            '[0:v]setpts=PTS-STARTPTS[theMovie]',
            '[1:v]scale=' + width + ':-1[bumperRescaled]',
            '[3:v]scale=' + width + 'x' + height + ',trim=duration=' + (duration + bumperLength - fade) + '[blackVideo]',
            '[bumperRescaled]format=yuva420p,setpts=PTS-STARTPTS+((' + (duration - fade) + ')/TB)[theBumper]',
            '[2:v]scale=' + width / 7 + ':-1[logoRescaled]', {
                filter: 'overlay',
                options: { x: 0, y: 0 },
                inputs: ['blackVideo', 'theMovie'],
                outputs: 'longMovie'
            }, {
                filter: 'overlay',
                options: { x: 10, y: 10 },
                inputs: ['longMovie', 'logoRescaled'],
                outputs: 'longMovieWithLogo'
            }, {
                filter: 'overlay',
                options: { x: 0, y: 0 },
                inputs: ['longMovieWithLogo', 'theBumper'],
                outputs: 'endMovie'
            }
        ];
    } else if (bumper !== false && logo === false) {
        ffmpegCommand = ffmpeg()
            .input(movie)
            .input(bumper)
            .input('color=c=black').inputOptions('-f lavfi');

        complexFilter = [
            // 'color=black:' + width + 'x' + height + ':d=' + duration + '[blackVideo]',
            '[0:v]setpts=PTS-STARTPTS[theMovie]',
            '[1:v]scale=' + width + ':-1[bumperRescaled]',
            '[2:v]scale=' + width + 'x' + height + ',trim=duration=' + duration + '[blackVideo]',
            '[bumperRescaled]format=yuva420p,setpts=PTS-STARTPTS+((' + (duration - fade) + ')/TB)[theBumper]', {
                filter: 'overlay',
                options: { x: 0, y: 0 },
                inputs: ['blackVideo', 'theMovie'],
                outputs: 'longMovie'
            }, {
                filter: 'overlay',
                options: { x: 0, y: 0 },
                inputs: ['longMovie', 'theBumper'],
                outputs: 'endMovie'
            }
        ];
    } else if (bumper === false && logo !== false) {
        ffmpegCommand = ffmpeg()
            .input(movie)
            .input(logo);
        complexFilter = [
            '[1:v]scale=' + width / 6 + ':-1[logoRescaled]', {
                filter: 'overlay',
                options: { x: 10, y: 10 },
                inputs: ['[0]', 'logoRescaled'],
                outputs: 'endMovie'
            }
        ];
    } else if (bumper === false && logo === false) {
        ffmpegCommand = ffmpeg()
            .input(movie);
    }

    // Check if we need to mix mulitple audiofiles
    if (audio !== false) {
        ffmpegCommand.input(audio);
        complexFilter.push('amix=inputs=2:duration=first:dropout_transition=3');
    } else {
        complexFilter.push('amix=inputs=1:duration=first:dropout_transition=3');
    }

    // Add the subs (in depends on branding or not)
    if (bumper === false && logo === false) {
        complexFilter.push('[0]ass=' + ass + '[out]');
    } else {
        complexFilter.push('[endMovie]ass=' + ass + '[out]');
    }

    var db = firebase.database();



    // run the command, do something when finished and print the
    ffmpegCommand.complexFilter(complexFilter, 'out')
        .outputOptions('-strict -2')
        .output(tempVideo)
        .on('start', function(commandLine) {
            console.log(commandLine);
            var ref = db.ref('logs/' + log + '/status/burningSubs').set(true).catch(function(error) {
                console.log('Failed to save to log', error);
            });
            // var ref = db.ref('logs/' + log + '/status/ffmpegLine').set(commandLine).catch(function(error) {
            //     console.log('Failed to save to log', error);
            // });
            res.send('started');
        })
        .on('error', function(err) {
            var ref = db.ref('logs/' + log + '/status/errorBurning').set({
                error: err
            }).catch(function(error) {
                console.log('Failed to save to log', error);
            });

            res.send('error');
        })
        .on('progress', function(progress) {
            var ref = db.ref('logs/' + log + '/status/ffmpegProgress').set(progress.percent).catch(function(error) {
                console.log('Failed to save to log', error);
            });
        })
        .on('end', function() {
            var ref = db.ref('logs/' + log + '/status/finishedBurning').set(true).catch(function(error) {
                console.log('Failed to save to log', error);
            });
            sendResultToDropbox(tempVideo, videoName, ass, email);
        })
        .run();


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

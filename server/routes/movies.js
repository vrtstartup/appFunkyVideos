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
var logger = require('../middleware/logger');
var emailService = require('../services/emailService.js');
var Promise = require('promise');


// var firebase = require('firebase');
// var firebaseService = require('../services/firebaseService.js');


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


function deleteLocalFile(path) {
    fs.stat(path, function(err, stats) {
        logger.info(stats); //here we got all information of file in stats variable
        if (err) {
            return console.error(err);
        }

        fs.unlink(path, function(err) {
            if (err) return logger.info(err);
            logger.info('file deleted successfully');
        });
    });
}


function uploadHiRes(filePath, dbPath) {
    console.log(filePath, dbPath);
    // Upload the hi res version
    fs.readFile(filePath, function(err, data) {
        logger.info('Start upload to Dropbox.');
        dbClient.filesUpload({ path: dbPath, contents: data, mode: 'overwrite' })
            .then(function(response) {})
            .catch(function(err) {
                logger.info(err);
                // logger.crit(err);
                return next(Boom.badImplementation('Something went wrong uploading to dropbox.'));
            });
    });
}

function sendResultToDropbox(video, videoName, ass, email) {
    logger.info('sending to Dropbox');
    var dbPath = '/subtitled/' + videoName + '.mp4';
    fs.readFile(video, function(err, data) {
        if (!dbClient) {
            logger.crit('No dbClient');
        } else {
            logger.info('writing to dropbox');
            dbClient.filesUpload({ path: dbPath, contents: data, mode: { '.tag': 'overwrite' } })
                .then(function(response) {
                    logger.info('Uploaded the file, let\s get the share url.');
                    dbClient.filesGetTemporaryLink({ path: dbPath }).then(function(response) {

                        tempUrl = response.link;
                        sendNotification(email, 'finished', tempUrl);

                        deleteLocalFile(ass);
                        deleteLocalFile(video);

                    });
                })
                .catch(function(err) {
                    logger.info(err);
                    return next(Boom.badImplementation('Something went wrong uploading to dropbox.'));
                });
        }
    });
}



router.post('/getTempUrl', function(req, res, next) {
    logger.info('getting Temp Url', req.body.path);
    dbClient.filesGetTemporaryLink({ path: req.body.path }).then(function(response) {
        logger.info('got temporary url', response);
        res.send(response.link);
    });
});




router.post('/upload-to-dropbox', function(req, res, next) {
    logger.info('received call to upload to dropbox');
    var fileName = '';
    var file = {};
    var count = 0;
    var dbPath = '';
    var response = {};
    var tempUrl = '';
    var tempPath = 'temp/subtitleVideos';
    var tempUrlSmall = '';
    var width = 0;
    var height = 0;
    var form = new multiparty.Form({ autoFiles: true, uploadDir: tempPath });
    // Add errors and so on (https://github.com/andrewrk/node-multiparty)


    form.on('error', function(err) {
        logger.crit('Error parsing form: ' + err.stack);
    });

    // Parts are emitted when parsing the form
    form.on('part', function(part) {
        // You *must* act on the part by reading it
        // NOTE: if you want to ignore it, just call "part.resume()"

        if (!part.filename) {

            // filename is not defined when this is a field and not a file
            logger.info('got field named ' + part.name);
            // ignore field's content
            part.resume();
        }

        if (part.filename) {
            // filename is defined when this is a file
            count++;
            logger.info('got file named ' + part.name);
            // ignore file's content here
            part.resume();
        }

        part.on('error', function(err) {
            logger.crit('Error on part: ' + err);
            // decide what to do
        });
    });

    // Close emitted after form parsed
    form.on('close', function() {
        logger.info('Take in completed!');


        // res.setHeader('video/mp4');
        // res.end('Received ' + count + ' files');
    });



    form.parse(req, function(err, fields, files) {
        Object.keys(fields).forEach(function(name) {
            logger.info('got field named ' + name);
        });

        Object.keys(files).forEach(function(name) {
            file = files[name][0];
            fileName = file.originalFilename.replace(/(?:\.([^.]+))?$/, '');

            dbPath = '/in/' + fileName + '.mp4';
            dbPathSmall = '/in/' + fileName + '_small.mp4';
            logger.info('the path where the file is now: ', file.path);
            logger.info('File should go to Dropbox at:', dbPath);

            // Upload hi res version
            uploadHiRes(file.path, dbPath);

            // Probe file for width and height
            ffmpeg.ffprobe(file.path, function(err, metadata) {
                if (err) {
                    logger.crit('Tried to probe the file using ffprobe, but returned error:', err);
                    return next(Boom.badImplementation('unexpected error, tried to probe the file, but returned error.'));
                }
                logger.info('ffprobe worked, checking if metadata is available.');
                if (metadata) {
                    logger.info('Metadata is available. Metadata: ', metadata);
                    logger.info('Looping through metadata, checking if codec_type = video');
                    for (i = 0; i < metadata.streams.length; i++) {
                        logger.info('Checking stream ' + i + ' for metadata.');
                        if (metadata.streams[i].codec_type === 'video') {
                            logger.info('Found a stream with codec Video. Stream ' + i);
                            logger.info('Checking stream ' + i + ' for width and height.');
                            width = metadata.streams[i].width;
                            logger.info('video width', width);
                            height = metadata.streams[i].height;
                            logger.info('video height', height);

                            logger.info('got everything, let\'s send this back for saving.');


                            tempUrlSmall = tempPath + '/' + fileName + '_small.mp4';

                            ffmpeg(file.path).size('320x?')
                                .outputOptions('-strict -2')
                                .audioCodec('copy')
                                .format('mp4')
                                .output(tempUrlSmall)
                                .on('start', function(commandLine) {
                                    logger.info('Started creating Low Res version.');
                                })
                                .on('error', function(err, stdout, stderr) {
                                    logger.crit('Error creating low res version.', err);
                                    logger.crit('ffmpeg stdout:\n' + stdout);
                                    logger.crit('ffmpeg stderr:\n' + stderr);

                                })
                                .on('progress', function(progress) {
                                    logger.info('creating low res version', progress);
                                })
                                .on('end', function() {
                                    logger.info('finished ffmpeg command');
                                    logger.info('reading file from temp location', tempUrlSmall)
                                    fs.readFile(tempUrlSmall, function(err, data) {
                                        var smallFile = data;

                                        if (err) {
                                            logger.crit('error while reading low res file', err);
                                        } else {
                                            logger.info('starting upload low res version', dbPathSmall);


                                            // TODO should be replaced by general send to dropbox function
                                            dbClient.filesUpload({ path: dbPathSmall, contents: smallFile, mode: 'overwrite' })
                                                .then(function(response) {

                                                    logger.info('done uploading the small file', response);
                                                    logger.info('Get the temp link of the small file');

                                                    deleteLocalFile(tempUrlSmall);
                                                    deleteLocalFile(file.path);

                                                    dbClient.filesGetTemporaryLink({ path: dbPathSmall })
                                                        .then(function(response) {
                                                            logger.info('got temporary url', response);

                                                            res.json({ image: response.link, dbPath: dbPath, width: width, height: height, fileName: fileName, filenameOut: fileName, filenameIn: fileName })
                                                                .send();
                                                        });
                                                })
                                                .catch(function(err) {
                                                    logger.crit('something went wrong uploading the low res file');

                                                });
                                        }
                                    });
                                })
                                .run();
                        }
                    }
                }
            });
        });
    });
});

router.post('/generateSub', multipartyMiddleware, function(req, res, next) {
    var path = "temp/subtitleVideos/";
    var file = req.files.file;
    var url = file.path;
    logger.info('url', url);
    var email = req.body.email;
    var filename = '';
    var dbPath = '';
    logger.info('email', email);
    logger.info('filepath', file.path);
    var name = (file.path).replace("temp/subtitleVideos/", '');
    logger.info('changed name', name);


    if (file.type === 'ass') {
        logger.info('file type = ass');
        const srtPath = path + req.body.fileName;
        const videoPath = (req.body.fileName).replace('.srt', '.mp4');
        fs.renameSync(path + name, srtPath);
        filename = 'gen' + videoPath;

        url = path + videoPath;
        dbPath = '/subs/' + req.body.fileName;

        // Upload it to dropbox, for backup, and if needed for templater
        fs.readFile(url, function(err, data) {
            if (!dbClient) {
                logger.info('No dbClient');
            } else {
                logger.info('uploading to dropbox');

                // fix: delete ass file if it exists
                const filePath = dbPath;
                dbClient.filesUpload({ path: dbPath, contents: data, mode: { '.tag': 'overwrite' } })
                    .then(function(response) {
                        dbClient.filesGetTemporaryLink({ path: dbPath }).then(function(response) {
                            tempUrl = response.link;
                            res.json({ url: url, name: videoPath, dropboxUrl: tempUrl }).send();
                        });
                    })
                    .catch(function(err) {
                        logger.info(err);
                        return next(Boom.badImplementation('unexpected error, couldn\'t upload file to dropbox'));
                    });
            }
        });
    } else {
        logger.info('file type is not ass');
        res.json({ url: url, name: videoPath, subtitled: false }).send();
    }
});



router.post('/burnSubs', function(req, res) {

    logger.info('starting burning of subs');
    const path = "temp/subtitleVideos/";

    var ass = req.body.ass;
    var movie = req.body.movie;
    var email = req.body.email;
    var logo = req.body.logo;
    var audio = req.body.audio;
    var bumper = req.body.bumper;
    var bumperAudio = req.body.bumperAudio;
    var duration = req.body.duration;
    var fade = req.body.fade;
    var width = req.body.width;
    var height = req.body.height;
    var project = req.body.project;
    var bumperLength = req.body.bumperLength;
    var visualClips = req.body.visualClips;

    var videoName = req.body.videoName;
    var tempVideo = path + videoName;
    var ffmpegCommand = '';
    var complexFilter = [];

    logger.info('the bumper:', bumper, 'the logo:', logo);
    if (bumper !== false && logo !== false) {

        ffmpegCommand = ffmpeg()
            .input(movie)
            .input(bumper)
            .input(logo)
            .input('color=c=black:s=' + width + 'x' + height).inputOptions('-f lavfi');
        complexFilter = [
            '[0:v]setpts=PTS-STARTPTS[theMovie]',
            '[1:v]scale=' + width + ':-1,format=yuva420p,setpts=PTS-STARTPTS+((' + (duration - fade) + ')/TB)[theBumper]',
            '[3:v]scale=' + width + 'x' + height + ',trim=duration=' + (duration + bumperLength - fade) + '[blackVideo]',
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
            .input('color=c=black:s=' + width + 'x' + height).inputOptions('-f lavfi');

        complexFilter = [
            '[0:v]setpts=PTS-STARTPTS[theMovie]',
            '[1:v]scale=' + width + ':-1,format=yuva420p,setpts=PTS-STARTPTS+((' + (duration - fade) + ')/TB)[theBumper]',
            '[2:v]scale=' + width + 'x' + height + ',trim=duration=' + (duration + bumperLength - fade) + '[blackVideo]',
            {
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
    if (audio !== false && bumperAudio !== true) {
        ffmpegCommand.input(audio);
        complexFilter.push('amix=inputs=2:duration=first:dropout_transition=3');
    } else if (bumperAudio === true) {
        var audioBumperDelay = (duration - fade) * 1000;
        complexFilter.push('[1:a]adelay=' + audioBumperDelay + '|' + audioBumperDelay + '[bumperSound];[0:1][bumperSound]amix=inputs=2');
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

    ffmpegCommand.complexFilter(complexFilter, 'out')
        .outputOptions('-strict -2')
        .output(tempVideo)
        .on('start', function(commandLine) {
            console.log(commandLine);
            res.send('started');
            logger.info('start running command');
            db.ref('/apps/subtitles/' + project + '/logs').update({
                status: 'Ondertitels aan het inbranden',
                ffmpegLine: commandLine
            }).catch(function(error) {
                logger.crit('Failed to save to log', error);

            });
        })
        .on('error', function(err) {
            logger.crit('error running ffmpeg command');
            // res.send(err.toString('utf8'));
            db.ref('/apps/subtitles/' + project + '/logs').update({
                status: 'Er is een fout opgetreden',
                error: err.toString('utf8')
            }).catch(function(error) {
                logger.crit('Failed to save to log', error);
            });
        })
        .on('progress', function(progress) {
            logger.info('progress: ' + progress.percent);
            if (progress.percent) {
                db.ref('/apps/subtitles/' + project + '/logs').update({
                    progress: progress.percent,
                }).catch(function(error) {
                    logger.crit('Failed to save to log', error);
                    return next(Boom.badImplementation('Opslaan van de log is mislukt'));
                });
            }
        })
        .on('end', function() {

            db.ref('/apps/subtitles/' + project + '/logs').update({
                status: 'Klaar met ondertitels inbranden.',
            }).catch(function(error) {
                logger.crit('Failed to save to log', error);
                return next(Boom.badImplementation('Opslaan van de log is mislukt'));
            });

            sendResultToDropbox(tempVideo, videoName, ass, email);

        })
        .run();
});



router.post('/update-movie-json', function(req, res, next) {
    var movieClips = req.body.movieClips;
    var data = [];
    var dbPath = '/json/templater.json';

    //update JSON file on dropbox so AE templater get's triggered
    dbClient.filesDownload({ path: dbPath })
        .then(function(response) {
            data = response.fileBinary;
            data = response.fileBinary ? JSON.parse(response.fileBinary) : [];
            // delete clips that have already been done
            for (var i = data.length - 1; i >= 0; i--) {
                if (data[i]['render-status'] == 'done') {
                    data.splice(i, 1);
                }
            }
            // add the new clips to the array
            movieClips.forEach(function(clip) {
                data.push(clip);
            });

            // overwrite the json with the new one
            data = JSON.stringify(data),
                dbClient.filesUpload({ contents: data, path: dbPath, mode: 'overwrite' })
                .then(function(response) {
                    logger.info('Upload of JSON is done');
                    res.send();
                })
                .catch(function(err) {
                    logger.info(err);
                    return next(Boom.badImplementation('unexpected error, couldn\'t upload file to dropbox'));
                });
        })
        .catch(function(err) {
            logger.info(err);
            return next(Boom.badImplementation('Something went wrong downloading the json for the templater from dropbox.'));
        });
});

module.exports = router;
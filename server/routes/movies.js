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
        console.log(stats); //here we got all information of file in stats variable
        if (err) {
            return console.error(err);
        }

        fs.unlink(path, function(err) {
            if (err) return console.log(err);
            console.log('file deleted successfully');
        });
    });
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
                    // deleteLocalFile(video);
                    // deleteLocalFile(ass);
                });
            });
        }
    });
}



// function uploadToDropbox(file) {
//     console.log(file);

//     fs.readFile(file.path, function(err, data) {
//         logger.info('Found a file, so let\'s read it out with fileStream.');
//         // imageUrl = '';
//         fileName = file.originalFilename.replace(/(?:\.([^.]+))?$/, '');
//         logger.info('changed the original filename, by deleting difficult characters. Filename is now: ' + fileName);
//         if (!dbClient) {
//             logger.crit('Dropbox Client is missing or not correctly implemented.');
//             return next(Boom.badImplementation('Dropbox Client is missing or not correctly implemented.'));
//         } else {
//             logger.info('Dropbox Client is there, let\'s write the file.');
//             // Should this not be fileName, in stead of originalFileName?
//             dbClient.writeFile('in/' + file.originalFilename, data, function(error, stat) {
//                 if (error) {
//                     logger.crit('couldn\'t upload file to dropbox', error);
//                     return next(Boom.badImplementation('unexpected error, couldn\'t upload file to dropbox'));
//                 }
//                 logger.info('status after upload, as returned by dropboxclient', stat);
//                 // Should this not be fileName, in stead of originalFileName?
//                 var fileUrl = 'in/' + file.originalFilename;
//                 logger.info('the file is now located in the dropbox app. Location is: ' + fileUrl);
//                 logger.info('Fetching the permanent url at Dropbox, so we can save the url to the Firebase.');
//                 dbClient.makeUrl(fileUrl, { downloadHack: true }, function(error, data) {
//                     if (error) {
//                         logger.crit('Wasn\'t able to fetch the url of the uploaded file. Returned error: ', error);
//                         return next(Boom.badImplementation('unexpected error, couldn\'t get file url from dropbox'));
//                     }
//                     logger.info('Fetched url for the file on dropbox, returned data: ', data);
//                     imageUrl = data.url;
//                     logger.info('the url for the file: ', imageUrl);
//                     logger.info('Trying to get the metadata of the file, using ffprobe.');
//                     ffmpeg.ffprobe(imageUrl, function(err, metadata) {
//                         if (err) {
//                             logger.crit('Tried to probe the file, but returned error:', err);
//                             return next(Boom.badImplementation('unexpected error, tried to probe the file, but returned error.'));
//                         }
//                         logger.info('ffprobe worked, checking if metadata is available.');
//                         if (metadata) {
//                             logger.info('Metadata is available. Metadata: ', metadata);
//                             logger.info('Looping through metadata, checking if codec_type = video');
//                             for (i = 0; i < metadata.streams.length; i++) {
//                                 logger.info('Checking stream ' + i + ' for metadata.');
//                                 if (metadata.streams[i].codec_type === 'video') {
//                                     logger.info('Found a stream with codec Video. Stream ' + i);
//                                     logger.info('Checking stream ' + i + ' for width and height.');
//                                     var width = metadata.streams[i].width;
//                                     logger.info('video width', width);
//                                     var height = metadata.streams[i].height;
//                                     logger.info('video height', height);
//                                     res.json({
//                                         image: imageUrl,
//                                         width: width,
//                                         height: height,
//                                         filenameOut: file.originalFilename.replace(/(?:\.([^.]+))?$/, ''),
//                                         filenameIn: file.originalFilename
//                                     }).send();
//                                 }
//                             }
//                         } else {
//                             logger.info('There is no stream with a videocodec, so the file is not a video.');
//                             res.json({
//                                 image: imageUrl,
//                                 filenameOut: file.originalFilename.replace(/(?:\.([^.]+))?$/, ''),
//                                 filenameIn: file.originalFilename
//                             }).send();
//                         }
//                     });
//                 });
//             });
//         }
//     });
// }

router.post('/upload-to-dropbox', function(req, res, next) {
    logger.info('received call to upload to dropbox');
    var fileName = '';
    var file = {};
    var count = 0;
    var form = new multiparty.Form();
    // Add errors and so on (https://github.com/andrewrk/node-multiparty)


    form.on('error', function(err) {
        console.log('Error parsing form: ' + err.stack);
    });

    // Parts are emitted when parsing the form
    form.on('part', function(part) {
        // You *must* act on the part by reading it
        // NOTE: if you want to ignore it, just call "part.resume()"

        if (!part.filename) {
            // filename is not defined when this is a field and not a file
            console.log('got field named ' + part.name);
            // ignore field's content
            part.resume();
        }

        if (part.filename) {
            // filename is defined when this is a file
            count++;
            console.log('got file named ' + part.name);
            // ignore file's content here
            part.resume();
        }

        part.on('error', function(err) {
            // decide what to do
        });
    });

    // Close emitted after form parsed
    form.on('close', function() {
        console.log('Upload completed!');
        // res.setHeader('video/mp4');
        // res.end('Received ' + count + ' files');
    });



    form.parse(req, function(err, fields, files) {
        Object.keys(fields).forEach(function(name) {
            console.log('got field named ' + name);
        });

        Object.keys(files).forEach(function(name) {
            // uploadToDropbox(files[name][0]);
            file = files[name][0];

            fs.readFile(file.path, function(err, data) {
                logger.info('Found a file, so let\'s read it out with fileStream.');
                // imageUrl = '';
                fileName = file.originalFilename.replace(/(?:\.([^.]+))?$/, '');
                logger.info('changed the original filename, by deleting difficult characters. Filename is now: ' + fileName);
                if (!dbClient) {
                    logger.crit('Dropbox Client is missing or not correctly implemented.');
                    return next(Boom.badImplementation('Dropbox Client is missing or not correctly implemented.'));
                } else {
                    logger.info('Dropbox Client is there, let\'s write the file.');
                    // Should this not be fileName, in stead of originalFileName?
                    dbClient.writeFile('in/' + file.originalFilename, data, function(error, stat) {
                        if (error) {
                            logger.crit('couldn\'t upload file to dropbox', error);
                            return next(Boom.badImplementation('unexpected error, couldn\'t upload file to dropbox'));
                        }
                        logger.info('status after upload, as returned by dropboxclient', stat);
                        // Should this not be fileName, in stead of originalFileName?
                        var fileUrl = 'in/' + file.originalFilename;
                        logger.info('the file is now located in the dropbox app. Location is: ' + fileUrl);
                        logger.info('Fetching the permanent url at Dropbox, so we can save the url to the Firebase.');
                        dbClient.makeUrl(fileUrl, { downloadHack: true }, function(error, data) {
                            if (error) {
                                logger.crit('Wasn\'t able to fetch the url of the uploaded file. Returned error: ', error);
                                return next(Boom.badImplementation('unexpected error, couldn\'t get file url from dropbox'));
                            }
                            logger.info('Fetched url for the file on dropbox, returned data: ', data);
                            imageUrl = data.url;
                            logger.info('the url for the file: ', imageUrl);
                            logger.info('Trying to get the metadata of the file, using ffprobe.');
                            ffmpeg.ffprobe(imageUrl, function(err, metadata) {
                                if (err) {
                                    logger.crit('Tried to probe the file, but returned error:', err);
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
                                            var width = metadata.streams[i].width;
                                            logger.info('video width', width);
                                            var height = metadata.streams[i].height;
                                            logger.info('video height', height);
                                            res.json({
                                                image: imageUrl,
                                                width: width,
                                                height: height,
                                                filenameOut: file.originalFilename.replace(/(?:\.([^.]+))?$/, ''),
                                                filenameIn: file.originalFilename
                                            }).send();
                                        }
                                    }
                                } else {
                                    logger.info('There is no stream with a videocodec, so the file is not a video.');
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


            console.log('got file named ' + name);
        });

        console.log('Upload completed!');


        // res.end('Received ' + files.length + ' files');
    });


    //if form contains file, open fileStream to get binary file
    // Parts are emitted when parsing the form


    // form.on('file', function(name, file) {
    //     logger.info('Found a file, so lets read it out with fileStream.');
    //     fs.readFile(file.path, function(err, data) {
    //         logger.info('Found a file, so let\'s read it out with fileStream.');
    //         // imageUrl = '';
    //         fileName = file.originalFilename.replace(/(?:\.([^.]+))?$/, '');
    //         logger.info('changed the original filename, by deleting difficult characters. Filename is now: ' + fileName);
    //         if (!dbClient) {
    //             logger.crit('Dropbox Client is missing or not correctly implemented.');
    //             return next(Boom.badImplementation('Dropbox Client is missing or not correctly implemented.'));
    //         } else {
    //             logger.crit('Dropbox Client is there, let\'s write the file.');
    //             // Should this not be fileName, in stead of originalFileName?
    //             dbClient.writeFile('in/' + file.originalFilename, data, function(error, stat) {
    //                 if (error) {
    //                     logger.crit('couldn\'t upload file to dropbox', error);
    //                     return next(Boom.badImplementation('unexpected error, couldn\'t upload file to dropbox'));
    //                 }
    //                 logger.info('status after upload, as returned by dropboxclient', stat);
    //                 // Should this not be fileName, in stead of originalFileName?
    //                 var fileUrl = 'in/' + file.originalFilename;
    //                 logger.info('the file is now located in the dropbox app. Location is: ' + fileUrl);
    //                 logger.info('Fetching the permanent url at Dropbox, so we can save the url to the Firebase.');
    //                 dbClient.makeUrl(fileUrl, { downloadHack: true }, function(error, data) {
    //                     if (error) {
    //                         logger.crit('Wasn\'t able to fetch the url of the uploaded file. Returned error: ', error);
    //                         return next(Boom.badImplementation('unexpected error, couldn\'t get file url from dropbox'));
    //                     }
    //                     logger.info('Fetched url for the file on dropbox, returned data: ', data);
    //                     imageUrl = data.url;
    //                     logger.info('the url for the file: ', imageUrl);
    //                     logger.info('Trying to get the metadata of the file, using ffprobe.');
    //                     ffmpeg.ffprobe(imageUrl, function(err, metadata) {
    //                         if (err) {
    //                             logger.crit('Tried to probe the file, but returned error:', err);
    //                             return next(Boom.badImplementation('unexpected error, tried to probe the file, but returned error.'));
    //                         }
    //                         logger.info('ffprobe worked, checking if metadata is available.');
    //                         if (metadata) {
    //                             logger.info('Metadata is available. Metadata: ', metadata);
    //                             logger.info('Looping through metadata, checking if codec_type = video');
    //                             for (i = 0; i < metadata.streams.length; i++) {
    //                                 logger.info('Checking stream ' + i + ' for metadata.');
    //                                 if (metadata.streams[i].codec_type === 'video') {
    //                                     logger.info('Found a stream with codec Video. Stream ' + i);
    //                                     logger.info('Checking stream ' + i + ' for width and height.');
    //                                     var width = metadata.streams[i].width;
    //                                     logger.info('video width', width);
    //                                     var height = metadata.streams[i].height;
    //                                     logger.info('video height', height);
    //                                     res.json({
    //                                         image: imageUrl,
    //                                         width: width,
    //                                         height: height,
    //                                         filenameOut: file.originalFilename.replace(/(?:\.([^.]+))?$/, ''),
    //                                         filenameIn: file.originalFilename
    //                                     }).send();
    //                                 }
    //                             }
    //                         } else {
    //                             logger.info('There is no stream with a videocodec, so the file is not a video.');
    //                             res.json({
    //                                 image: imageUrl,
    //                                 filenameOut: file.originalFilename.replace(/(?:\.([^.]+))?$/, ''),
    //                                 filenameIn: file.originalFilename
    //                             }).send();
    //                         }
    //                     });
    //                 });
    //             });
    //         }
    //     });
    // });
});

router.post('/generateSub', multipartyMiddleware, function(req, res, next) {
    const path = "temp/subtitleVideos/";
    var file = req.files.file;

    var url = file.path;
    console.log('url', url);
    var email = req.body.email;
    console.log('email', email);
    console.log('filepath', file.path);
    var name = (file.path).replace("temp/subtitleVideos/", '');
    console.log('changed name', name);

    if (file.type === 'ass') {
        console.log('file type = ass');
        const srtPath = path + req.body.fileName;
        const videoPath = (req.body.fileName).replace('.srt', '.mp4');
        fs.renameSync(path + name, srtPath);
        var filename = 'gen' + videoPath;

        // burn subtitles
        url = path + videoPath;

        // Upload it to dropbox, for backup, and if needed for templater
        fs.readFile(url, function(err, data) {
            if (!dbClient) {
                console.log('No dbClient');
            } else {
                console.log('uploading to dropbox');
                dbClient.writeFile('subs/' + req.body.fileName, data, function(error, stat) {
                    if (error) {
                        console.log('ERROR:', error);
                        return next(Boom.badImplementation('unexpected error, couldn\'t upload file to dropbox'));
                    }
                    var fileUrl = 'subs/' + req.body.fileName;
                    dbClient.makeUrl(fileUrl, { downloadHack: true }, function(error, data) {
                        dropboxUrl = data.url;
                        res.json({ url: url, name: videoPath, dropboxUrl: dropboxUrl }).send();
                    });
                });
            }
        });
    } else {
        console.log('file type is not ass');
        res.json({ url: url, name: videoPath, subtitled: false }).send();
    }
});

router.post('/burnSubs', function(req, res) {
    console.log('starting burning of subs');
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
    var project = req.body.project;
    var bumperLength = req.body.bumperLength;
    var visualClips = req.body.visualClips;

    var videoName = req.body.videoName;
    var tempVideo = path + videoName;
    var ffmpegCommand = '';
    var complexFilter = [];

    console.log('the bumper:', bumper, 'the logo:', logo);
    if (bumper !== false && logo !== false) {

        ffmpegCommand = ffmpeg()
            .input(movie)
            .input(bumper)
            .input(logo)
            .input('color=c=black:s=' + width + 'x' + height).inputOptions('-f lavfi');
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
        console.log('no logo, no bumper');
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
            db.ref('/apps/subtitles/' + project + '/logs').update({
                status: 'Ondertitels aan het inbranden',
                ffmpegLine: commandLine
            }).catch(function(error) {
                console.log('Failed to save to log', error);

            });
        })
        .on('error', function(err) {
            res.send(err.toString('utf8'));
            db.ref('/apps/subtitles/' + project + '/logs').update({
                status: 'Er is een fout opgetreden',
                error: err.toString('utf8')
            }).catch(function(error) {
                console.log('Failed to save to log', error);
            });


        })
        .on('progress', function(progress) {
            if (progress.percent) {
                db.ref('/apps/subtitles/' + project + '/logs').update({
                    progress: progress.percent,
                }).catch(function(error) {
                    console.log('Failed to save to log', error);
                    return next(Boom.badImplementation('Opslaan van de log is mislukt'));
                });
            }
        })
        .on('end', function() {
            db.ref('/apps/subtitles/' + project + '/logs').update({
                status: 'Klaar met ondertitels inbranden.',
            }).catch(function(error) {
                console.log('Failed to save to log', error);
                return next(Boom.badImplementation('Opslaan van de log is mislukt'));
            });
            sendResultToDropbox(tempVideo, videoName, ass, email);
            res.send('ended');
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

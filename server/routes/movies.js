var express = require('express');
var router = express.Router();
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var multiparty = require('multiparty');
var connectMultiparty = require('connect-multiparty');
var multipartyMiddleware = connectMultiparty({ uploadDir: 'temp/subtitleVideos/' });
var exec = require('child_process').exec;

var Boom = require('boom');
var dropboxService = require('../services/dropboxService.js');
var dbClient = dropboxService.getDropboxClient();

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



function sendNotification(email, url) {

    // var fullUrl = 'http://nieuwshub.vrt.be/#/download/' + url;
    var subject = 'Uw video met ondertitels is klaar om te downloaden!';
    var message = "<p>Beste collega,</p><p>Uw video met ondertitels is klaar, u kan hem hier downloaden:<br /> <a href=" + url +
        ">" + url + "</a></p><p>Nog een prettige dag verder,</p><p>De Hub Server</p>";
    emailService.sendMail(email, subject, message);
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
                }
                var fileUrl = 'subtitled/' + videoName;
                dbClient.makeUrl(fileUrl, { downloadHack: true }, function(error, data) {
                    console.log('data', data);
                    sendNotification(email, 'https://www.dropbox.com/sh/cjfyjgupjbsdivh/AAB8zeW3Yc3cATefpKJV1ccha?dl=0');
                    // Delete the tempVideo and the ass-File
                    fs.unlinkSync(video);
                    fs.unlinkSync(ass);
                });
            });
        }
    });

}


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

                        console.log(error);

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


// //url /api/movie
// router.post('/upload-to-dropbox', function(req, res, next) {
//     //handle file with multer - read file to convert into binary - save file to dropbox
//     var form = new multiparty.Form();
//     form.parse(req);
//     //if form contains file, open fileStream to get binary file
//     form.on('file', function(name, file) {
//         fs.readFile(file.path, function(err, data) {
//             var imageUrl = '';
//             var fileName = time() + '.ass';
//             if (!dbClient) {
//                 console.log('No dbClient');
//             } else {
//                 dbClient.writeFile('in/' + fileName, data, function(error, stat) {
//                     if (error) {
//                         console.log('ERROR:', error);
//                         return next(Boom.badImplementation('unexpected error, couldn\'t upload file to dropbox'));
//                     }
//                     var fileUrl = 'srt/' + fileName;
//                     dbClient.makeUrl(fileUrl, { downloadHack: true }, function(error, data) {
//                         console.log(data);
//                         imageUrl = data.url;
//                         console.log(error);
//                         // ffmpeg.ffprobe(imageUrl, function(err, metadata) {
//                         res.json({
//                             image: imageUrl,
//                             filenameOut: file.originalFilename.replace(/(?:\.([^.]+))?$/, ''),
//                             filenameIn: file.originalFilename
//                         }).send();
//                         // });
//                     });
//                 });
//             }
//         });
//     });

// });




router.post('/generateSub', multipartyMiddleware, function(req, res, next) {
    const path = "temp/subtitleVideos/";
    var file = req.files.file;
    var url = file.path;
    var email = req.body.email;
    console.log(req.body);
    var name = (file.path).replace("temp/subtitleVideos/", '');

    // const ext = getExtension(file.name);
    if (file.type === 'ass') {
        const srtPath = path + req.body.fileName;
        const videoPath = (req.body.fileName).replace('.srt', '.mp4');
        fs.renameSync(path + name, srtPath);
        var filename = 'gen' + videoPath;
        // burn subtitles
        url = path + videoPath;
        res.json({ url: url, name: videoPath }).send();
    } else {
        res.json({ url: url, name: videoPath, subtitled: false }).send();
    }
});



router.post('/burnSubs', function(req, res) {
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
    var videoName = time() + '_' + (email.substring(0, email.indexOf("@"))).replace('.', '') + '.mp4';
    var tempVideo = path + videoName;




    // var ffmpegCommand = 'ffmpeg -i ' + movie + ' -i ' + bumper + ' -i ' + logo + ' -filter_complex "color=black:1920x1080:d=' + duration + '[base];[0:0]scale=1920:1080;[1:v]setpts=PTS-STARTPTS+((' + (duration - fade) + ')/TB)[bumper];[base][0:v]overlay[tmp];[tmp][bumper]overlay[allOverlayed];[allOverlayed]ass=' + ass + '[out]" -map [out] ' + tempVideo;
    // var ffmpegCommand = 'ffmpeg -i ' + movie + ' -i ' + bumper + ' -i ' + logo + ' -filter_complex "color=black:1920x1080:d=' + duration + '[base];[0:v]scale=1920:1080,setpts=PTS-STARTPTS;[1:v]setpts=PTS-STARTPTS+((' + (duration - fade) + ')/TB)[bumper];[base][v0]overlay[tmp];[tmp][bumper]overlay[allOverlayed],[allOverlayed]ass=' + ass + '[out]" -map [out] -map 0:1 -c copy -c:v libx264 -b:v 1000k ' + tempVideo;
    // var ffmpegCommand = 'ffmpeg -i ' + movie + ' -i ' + bumper + ' -i ' + logo + ' -filter_complex "color=black:1920x1080:d=' + duration + '[base];[0:v]setpts=PTS-STARTPTS[v0];[1:v]format=yuva420p,setpts=PTS-STARTPTS+((' + (duration - fade) + ')/TB)[v1];[base][v0]overlay[tmp];[tmp][v1]overlay,format=yuv420p[fv],[fv]ass=' + ass + '[sub],[sub][2:v]overlay=10:10[out]" -map [out] -c copy -c:v libx264 -b:v 1000k ' + tempVideo;














    if (bumper !== false && logo !== false) {

        var ffmpegCommandBumperLogo = ffmpeg()
            .input(movie)
            .input(bumper)
            .input(logo)
            .complexFilter([
                'color=black:' + width + 'x' + height + ':d=' + duration + '[blackVideo]',
                '[0:v]setpts=PTS-STARTPTS[theMovie]',
                '[1:v]scale=' + width + ':-1[bumperRescaled]',
                '[bumperRescaled]format=yuva420p,setpts=PTS-STARTPTS+((' + (duration - fade) + ')/TB)[theBumper]',
                '[2:v]scale=' + width / 5 + ':-1[logoRescaled]', {
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
                    outputs: 'longMovieWithLogoAndBumper'
                },
                '[longMovieWithLogoAndBumper]ass=' + ass + '[out]'
            ], 'out')
            .on('start', function(commandLine) {
                console.log('Spawned Ffmpeg with command: ' + commandLine);
            })
            .on('error', function(err) {
                console.log('An error occurred: ' + err.message);
            })
            .on('end', function() {
                console.log('Processing finished !');
                sendResultToDropbox(tempVideo, videoName, ass, email);

            })
            .save(tempVideo);
    } else if (bumper !== false && logo === false) {
        var ffmpegCommandBumper = ffmpeg()
            .input(movie)
            .input(bumper)
            .complexFilter([
                'color=black:' + width + 'x' + height + ':d=' + duration + '[blackVideo]',
                '[0:v]setpts=PTS-STARTPTS[theMovie]',
                '[1:v]scale=' + width + ':-1[bumperRescaled]',
                '[bumperRescaled]format=yuva420p,setpts=PTS-STARTPTS+((' + (duration - fade) + ')/TB)[theBumper]', {
                    filter: 'overlay',
                    options: { x: 0, y: 0 },
                    inputs: ['blackVideo', 'theMovie'],
                    outputs: 'longMovie'
                }, {
                    filter: 'overlay',
                    options: { x: 0, y: 0 },
                    inputs: ['longMovie', 'theBumper'],
                    outputs: 'longMovieWithBumper'
                },
                '[longMovieWithBumper]ass=' + ass + '[out]'
            ], 'out')
            .on('start', function(commandLine) {
                console.log('Spawned Ffmpeg with command: ' + commandLine);
            })
            .on('error', function(err) {
                console.log('An error occurred: ' + err.message);
            })
            .on('end', function() {
                console.log('Processing finished !');
                sendResultToDropbox(tempVideo, videoName, ass, email);

            })
            .save(tempVideo);
    } else if (bumper === false && logo !== false) {
        var ffmpegCommandLogo = ffmpeg()
            .input(movie)
            .input(logo)
            .complexFilter([
                '[1:v]scale=' + width / 5 + ':-1[logoRescaled]', {
                    filter: 'overlay',
                    options: { x: 10, y: 10 },
                    inputs: ['[0]', 'logoRescaled'],
                    outputs: 'movieWithLogo'
                },
                '[movieWithLogo]ass=' + ass + '[out]'
            ], 'out')
            .on('start', function(commandLine) {
                console.log('Spawned Ffmpeg with command: ' + commandLine);
            })
            .on('error', function(err) {
                console.log('An error occurred: ' + err.message);
            })
            .on('end', function() {
                console.log('Processing finished !');
                sendResultToDropbox(tempVideo, videoName, ass, email);
            })
            .save(tempVideo);

    } else if (bumper === false && logo === false) {
        var ffmpegCommandNoBranding = ffmpeg()
            .input(movie)
            .complexFilter([
                '[0]ass=' + ass + '[out]'
            ], 'out')
            .on('start', function(commandLine) {
                console.log('Spawned Ffmpeg with command: ' + commandLine);
            })
            .on('error', function(err) {
                console.log('An error occurred: ' + err.message);
            })
            .on('end', function() {
                console.log('Processing finished !');
                sendResultToDropbox(tempVideo, videoName, ass, email);
            })
            .save(tempVideo);
    }



    // ffmpeg = ffmpeg + ' && ffmpeg -i ' + folder + project + state + '.mp4' + ' ' + folder + project + '_audioTrack.mp3 && ffmpeg -i ' + folder + project + 'audioTrack.mp3 -i ' + this.audioTracks[audio].fileRemote + ' -filter_complex amerge -c:a libmp3lame -q:a 4 ' + folder + project + 'audioMix.mp3 && ffmpeg -i ' + folder + project + state + '.mp4' + ' -i ' + folder + project + 'audioMix.mp3 -c:v copy -c:a aac -strict experimental -map 0:v:0 -map 1:a:0 ' + folder + project + state + '_audio.mp4';

    // console.log(testCommand);
    // var ffmpegProcess = exec(testCommand);


    // ffmpegProcess.stdout.on('data', function(data) {
    //     console.log('stdout: ' + data);
    // });
    // ffmpegProcess.stderr.on('data', function(data) {
    //     console.log('stderr ass: ' + data);
    // });
    // ffmpegProcess.on('close', function(code) {
    //     if (code !== 0) {
    //         console.log('program exited error code:', code);
    //         return;
    //     }
    //     fs.readFile(tempVideo, function(err, data) {
    //         if (!dbClient) {
    //             console.log('No dbClient');
    //         } else {
    //             dbClient.writeFile('subtitled/' + videoName, data, function(error, stat) {
    //                 console.log('stat', stat);
    //                 if (error) {
    //                     console.log('ERROR:', error);
    //                     return next(Boom.badImplementation('unexpected error, couldn\'t upload file to dropbox'));
    //                 }
    //                 var fileUrl = 'subtitled/' + videoName;
    //                 dbClient.makeUrl(fileUrl, { downloadHack: true }, function(error, data) {
    //                     console.log('data', data);
    //                     sendNotification(email, 'https://www.dropbox.com/sh/cjfyjgupjbsdivh/AAB8zeW3Yc3cATefpKJV1ccha?dl=0');
    //                     // Delete the tempVideo and the ass-File
    //                     fs.unlinkSync(tempVideo);
    //                     fs.unlinkSync(ass);
    //                 });
    //             });
    //         }
    //     });
    // });

});


router.post('/update-movie-json', function(req, res, next) {
    var movieClips = req.body.movieClips;

    //update dropbox json
    var file = {
        path: '/json/',
        name: 'templater.json',
        data: ''
    };
    console.log(movieClips);
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

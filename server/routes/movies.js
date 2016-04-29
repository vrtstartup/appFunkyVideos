var express = require('express');
var router = express.Router();
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var multiparty = require('multiparty');
var lodash = require('lodash');
var Q = require('q');
var exec = require('child_process').exec;
var Firebase = require('firebase');
var shortId = require('shortid');
var Boom = require('boom');



var movies = new Firebase("vrtnieuwshub.firebaseio.com/apps/movies/movies");
var movieClips = new Firebase("https://vrtnieuwshub.firebaseio.com/apps/movies/movieclips");

var dropboxService = require('../services/dropboxService.js');
var dbClient = dropboxService.getDropboxClient();

var jsonFile = 'data/json/templater.json';
var renderFolder = 'temp/movies/in';

//url /api/movie

router.post('/movie-clip', function(req, res, next) {
    var form = new multiparty.Form();
    form.parse(req);

    var fileStream = '';
    var fileStreamOpened = false;
    var fileName = '';
    var fileExt = '';
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
                    fileExt = getExtension(part.filename);
                    fullPath = uploadPath + fileName + fileExt;

                    //check if dir exists else create it
                    //if (!fs.existsSync(uploadPath)) {
                    //    fs.mkdirSync(uploadPath);
                    //}

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
        res.json({filePath: fullPath, fileName: fileName + fileExt}).send();
    });
});

router.post('/upload-to-dropbox', function(req, res, next) {
    //handle file with multer - read file to convert into binary - save file to dropbox
    var form = new multiparty.Form();

    form.parse(req);

    //if form contains file, open fileStream to get binary file
    form.on('file', function(name, file) {

        console.log('upload-to-dropbox', file);

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

router.post('/update-movie-json', function(req, res, next) {
    var movieClips = req.body.movieClips;

    //update local JS
    //fs.access('data/json', fs.F_OK, function(err) {
    //    if(err) {
    //        console.log('creating json directory');
    //        fs.mkdirSync('data/json');
    //    }
    //
    //    console.log('dir exists');
    //
    //    //append clips to json file on server
    //    var file = [];
    //
    //    fs.access(jsonFile, fs.F_OK, function(err) {
    //        if (!err) {
    //            //if file exists, append contents to file
    //            file = fs.readFileSync(jsonFile, 'utf8');
    //
    //            if (file.length > 0) {
    //                file = JSON.parse(file);
    //            }
    //            else {
    //                file = [];
    //            }
    //        }
    //
    //        movieClips.forEach(function(clip) {
    //            file.push(clip);
    //        });
    //
    //        fs.writeFile(jsonFile, JSON.stringify(file), (err) => {
    //            if(err) {
    //                console.log('failed to write file');
    //            }
    //
    //            fs.chmod(jsonFile, 511);
    //
    //            console.log('updated templater.json');
    //            res.send();
    //        });
    //    });
    //});

    //update dropbox json
    var file = {
        path: '/json/',
        name: 'templater.json',
        data: ''
    };

    console.log('DROP BOX', dbClient);

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

//router.post('/delete-movie-json', function(req, res, next) {
//    var clipId = req.body.clipId || 0;
//
//    file = fs.readFileSync(jsonFile, 'utf8');
//
//    if (file.length > 0) {
//
//        file = JSON.parse(file);
//
//        file = lodash.reject(file, function (clip) {
//            return clip.id === clipId;
//        });
//
//        fs.writeFile(jsonFile, JSON.stringify(file), (err) => {
//            if (err) {
//                console.log('failed to write file');
//            }
//
//            fs.chmod(jsonFile, 511);
//
//            console.log('deleted following id from templater', clipId);
//            res.send();
//        });
//    }
//    //check if last clip in movie, if so, start render
//});

router.post('/clean-movie-json', function(req, res, next) {
    var path = '/json/templater.json';
    dbClient.writeFile(path, '[]', function(error, stat) {
        if (error) {
            return next(Boom.badImplementation('unexpected error, couldn\'t upload file to dropbox'));
        }
        console.log('succesfully cleared json file');
        res.send();
    });
});

router.post('/render-movie', function(req, res, next) {
    var movieId = req.body.movieId || 0;

    console.log('rendering movie with id:', movieId);

    var ref = new Firebase('vrtnieuwshub.firebaseio.com/apps/movies').child("movieclips");
    ref.orderByChild('movieId').equalTo(movieId).on("value", function(snapshot) {
        var clipFileNames = [];
        snapshot.forEach(function(child) {
            var childData = child.val();
            clipFileNames.push(childData.output);
        });

        res.json({data: 'rendering your movie!'}).send();

        stitchClips(clipFileNames)
            .then(function(result) {
                console.log('++++++ after stitchClips ', result);
                //#todo send mail and have a part
            });
    });
});

// to stitch all the clips, you first need to transfer them from Dropbox to our server so FFMPEG can work with them
// ISACCO first needs to fix a preset so the files uploaded to dropbox aren't HUGE.
// all files on the windows PC are in D:\imagetest for this project
// once they're transferred, you can start stitching them
// all this code needs to be variable to multiple files of course
// see templater.js - certain parts can be reused or can be used as inspiration :-)
// have fun

function stitchClips(clipFileNames) {
    var deferred = Q.defer();

    var promises = [];

    //filename is without file extension, you'll probably need to add this
    clipFileNames.forEach(function(filename) {
        //for each clip for this movieId, transfer all the clips from dropbox to local disk
        //this is an array of promises, when every promises is resolved (so when all files are transfered), the code inside Q.all will run
        promises.push(transferFileToDisk(filename));
    });

    Q.all(promises)
        .then(function(results) {
            console.log('transferred', results.length, 'files');
            return renderMovie(results); //return the resolved promise of this function to the next then
        })
        .then(function() {
            deferred.resolve('transferred all files and stitched them'); //resolving this will trigger the THEN of stitchClips, thus send the e-mail
        })
        .catch(function(err) {
           console.log('Somewhere along the way, it went wrong', err);
        });

    return deferred.promise;
}

function transferFileToDisk(filename) {
    //#todo test if file transfer works and puts it in the correct folder /temp/movies/in, and uses the correct extensions
    var deferred = Q.defer();

    dbClient.readFile('out/' + filename, {buffer: true}, function(error, data) {
        if (error) {
            return next(Boom.badImplementation('unexpected error, couldn\'t open file from dropbox'));
        }

        fs.writeFile(renderFolder + filename + '.mp4', data, function(err) {
            if (err) deferred.reject(new Error(err));
            else {
                deferred.resolve({filePath: renderFolder + 'in' + fileName + '.mp4'});
            }
        });
    });

    return deferred.promise;
};

function renderMovie(localFilePaths) {
    //#todo stitch together files with ffmpeg
    var deferred = Q.defer();

    //#todo fix FFMPEG line with variable inputs
    var ffmpegCommand = "ffmpeg ...";

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

        deferred.resolve('finished rendering movie');
    });
}

function getExtension(filename) {
    var parts = filename.split('.');
    return '.' + parts[parts.length - 1];
}

module.exports = router;

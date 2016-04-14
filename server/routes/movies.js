var express = require('express');
var router = express.Router();
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var multiparty = require('multiparty');
var lodash = require('lodash');

var dropboxService = require('../services/dropboxService.js');
var dbClient = dropboxService.getDropboxClient();

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

router.post('/update-movie-json', function(req, res, next) {
    var movieClips = req.body.movieClips;
    var jsonFile = 'data/json/templater.json';

    fs.access('data/json', fs.F_OK, function(err) {
        if(err) {
            console.log('creating json directory');
            fs.mkdirSync('data/json');
        }

        console.log('dir exists');

        //append clips to json file on server
        var file = [];

        fs.access(jsonFile, fs.F_OK, function(err) {
            if (!err) {
                //if file exists, append contents to file
                file = fs.readFileSync(jsonFile, 'utf8');

                if (file.length > 0) {
                    file = JSON.parse(file);
                }
                else {
                    file = [];
                }
            }

            movieClips.forEach(function(clip) {
                file.push(clip);
            });

            fs.writeFile(jsonFile, JSON.stringify(file), (err) => {
                if(err) {
                    console.log('failed to write file');
                }

                fs.chmod(jsonFile, 511);

                console.log('updated templater.json');
                res.send();
            });
        });
    });
});

router.post('/delete-movie-json', function(req, res, next) {
    file = fs.readFileSync(jsonFile, 'utf8');

    console.log('body', req.body);
    console.log('data', req.data);

    if (file.length > 0) {

        file = JSON.parse(file);

        lodash.reject(file, function (clip) {
            return clip.id === req.data.clipId;
        });

        fs.writeFile(jsonFile, JSON.stringify(file), (err) => {
            if (err) {
                console.log('failed to write file');
            }

            fs.chmod(jsonFile, 511);

            console.log('updated templater.json');
            res.send();
        });
    }
});

router.post('/render-movie', function(req, res, next) {
    //stitch together movie by folder ID, put result in download folder, delete all temp files
    console.log('rendering movie!');
    res.json({data: 'rendering movie!'}).send();
});

function getExtension(filename) {
    var parts = filename.split('.');
    return '.' + parts[parts.length - 1];
}

module.exports = router;

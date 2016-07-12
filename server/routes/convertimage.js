var express = require('express');
var router = express.Router();
var fs = require('fs');
var gm = require('gm').subClass({imageMagick: true});
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty({ uploadDir: 'temp/templates/' });

var exec = require('child_process').exec;

router.get('/convertimage', function(req, res, next) {
    res.json({ message: 'convertimage get api' }).send();
});

router.post('/convertimage/:type', multipartyMiddleware, function(req, res, next) {
    if(!req.files.file) return;


    var file = req.files.file;
    var type = req.params.type;

    if (type === 'grayscale') {
        gm(file.path)
            .type('grayscale')
            .write(file.path, (err) => {
                    //if (err) return console.dir('Error is occured', err, arguments);
                    var path = 'http://'+req.headers.host+'/'+file.path;
                    console.log('DONE',  path);
                    res.json({url: path}).send();
                }
            );
    }

    if (type === 'noise') {
        gm(file.path)
            .contrast(1)
            .noise("laplacian")
            .write(file.path, (err) => {
                    if (err) return console.dir('Error is occured', err, arguments);
                    var path = 'http://'+req.headers.host+'/'+file.path;
                    console.log('DONE',  path);
                    res.json({url: path}).send();
                }
            );
    }

    if(type === 'vibrance') {
        console.log('~~~~~~vibrance');
        var cmd = 'convert -brightness-contrast 0x25 ' + file.path + ' ' + file.path;
        var imagemagicProcess = exec(cmd);

        imagemagicProcess.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        imagemagicProcess.stderr.on('data', function(data) {
            console.log('stderr mov: ' + data);
        });
        imagemagicProcess.on('close', function(code) {
            if (code !== 0) {
                console.log('program exited error code:', code);
                return;
            }
            var path = 'http://'+req.headers.host+'/'+file.path;
            console.log('DONE',  path);
            res.json({url: path}).send();
        });
    }


});


module.exports = router;

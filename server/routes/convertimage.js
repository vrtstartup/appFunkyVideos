var express = require('express');
var router = express.Router();
var fs = require('fs');
var gm = require('gm').subClass({imageMagick: true});
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty({ uploadDir: 'temp/templates/' });


router.post('/convertimage/:type', multipartyMiddleware, function(req, res, next) {

    if(!req.files.file) return;

    var file = req.files.file;
    var type = req.params.type;

    console.log('Req', req.headers.host+'/'+file.path);
    console.log("type is set to " + req.params.type);

    if (type === 'grayscale') {
        gm(file.path)
            .type('grayscale')
            .write(file.path, (err) => {
                    if (err) return console.dir('Error is occured', err, arguments);
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


});

//url /api
router.get('/convertimage', function(req, res) {
    res.json({ message: 'get convertimage' }).send();
});



module.exports = router;

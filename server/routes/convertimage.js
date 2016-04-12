var express = require('express');
var router = express.Router();
var Jimp = require("jimp");
var fs = require('fs');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty({ uploadDir: 'temp/templates/' });


router.post('/convertimage', multipartyMiddleware, function(req, res, next) {

    var file = req.files.file;

    console.log('Req', req.headers.host+'/'+file.path);

    Jimp.read(file.path, (err, lenna) => {
        if (err) {
            console.log('ERROR', err);
            throw err;
        }
        lenna.gaussian(2)                 // set greyscale
            .write(file.path, () => {
                var path = 'http://'+req.headers.host+'/'+file.path;
                console.log('DONE',  path);
                res.json({url: path}).send();
            }); // save

    });

});

//url /api
router.get('/convertimage', function(req, res) {


    res.json({ message: 'get convertimage' }).send();
});



module.exports = router;

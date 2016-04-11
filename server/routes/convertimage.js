var express = require('express');
var router = express.Router();
var Jimp = require("jimp");
var fs = require('fs');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty({ uploadDir: 'temp/templates/' });


router.post('/convertimage', multipartyMiddleware, function(req, res, next) {

    var file = req.files.file;

    Jimp.read(file.path, (err, lenna) => {
        if (err) throw err;
        lenna.greyscale()                 // set greyscale
            .write(file.path, () => {
                res.json({url: file.path}).send();
            }); // save

    });

});

//url /api
router.get('/convertimage', function(req, res) {


    res.json({ message: 'get convertimage' }).send();
});



module.exports = router;

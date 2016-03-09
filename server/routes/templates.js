var express = require('express');
var router = express.Router();
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');


//url /api
router.get('/templates', function(req, res) {

    res.json({ message: 'templates get api' }).send();
});

router.post('/templates', function(req, res, next) {

    var files = fs.readdirSync('temp/templates').length;
    var buff  = [];

    if (files < 10) {
        files = '00' + files;
    } else if (files > 9 && files < 100) {
        files = '0' + files;
    }

    var fileName = 'img' + files;
    var path     = 'temp/templates/' + fileName + '.jpeg';


    // Converting blob to png & writing it to /temp
    req.on('data', function (data) {
            buff.push(data);
        })
        .on('error', next)
        .on('end', function () {
            fs.writeFile(path, Buffer.concat(buff), function (err) {
                if (err) return next(err); // something went wrong with the fs, return 500

                res.json({ template_url: path }).send();// success!
            });
        });
});


module.exports = router;

var express = require('express');
var router = express.Router();
var Boom = require('boom');
var Dropbox = require('dropbox');
var fs = require('fs');
var multiparty = require('multiparty');

//var multiparty = require('connect-multiparty');
//var multipartyMiddleware = multiparty({ uploadDir: 'temp/templaterVideos/' });

//url /api
router.post('/templaterVideo', function(req, res, next) {
    //handle dropbox login (with ENV variables)
    var db_key = process.env.DB_KEY;
    var db_secret = process.env.DB_SECRET;
    var db_token = process.env.DB_TOKEN;

    if(!db_key || !db_secret || !db_token) {
        return next(Boom.badRequest('no key/secret or token found'));
    }

    var client = new Dropbox.Client({
        key: db_key,
        secret: db_secret,
        token: db_token,
        sandbox: false
    });

    //handle file with multer - read file to convert into binary - save file to dropbox
    var form = new multiparty.Form();

    form.parse(req);

    form.on('file', function(name, file) {
        fs.readFile(file.path, function(err, data) {
            client.writeFile(file.originalFilename, data, function(error, stat) {
                if(error) {
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

module.exports = router;

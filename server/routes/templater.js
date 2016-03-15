var express = require('express');
var router = express.Router();
var Dropbox = require('dropbox');

//url /api
router.post('/templaterVideo', function(req, res) {

    //upload video to dropbox

    //sign in to dropbox app, get key/secret from ENV
    var db_key = process.env.DB_KEY;
    var db_secret = process.env.DB_SECRET;
    var db_token = process.env.DB_TOKEN;

    if(db_key || db_secret || db_token) {

    }

    var client = new Dropbox.Client({
        key: db_key,
        secret: db_secret,
        token: db_token,
        sandbox: false
    });

    client.writeFile("hello_world.txt", "Hello, world!\n", function(error, stat) {
        if (error) {
            console.log(error);
            return;
        }

        console.log("File saved");
        res.json({ message: 'file saved'}).send();
    });

    //dbClient.readdir("/", function(error, entries) {
    //    if(error) {
    //        console.log(error);
    //        return;
    //    }
    //
    //    res.json(entries).send();
    //});

    //setTimeout(() => {
    //    res.json({ message: 'templates post api' }).send();
    //}, 2000)
});

module.exports = router;

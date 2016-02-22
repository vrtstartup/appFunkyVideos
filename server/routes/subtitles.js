var express = require('express');
var router = express.Router();
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var findRemoveSync = require('find-remove');


//url /api
router.get('/subtitles', function(req, res) {

    res.json({ message: 'subtitles get api' }).send();
});


module.exports = router;

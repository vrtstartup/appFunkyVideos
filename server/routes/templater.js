var express = require('express');
var router = express.Router();

//url /api
router.post('/templaterVideo', function(req, res) {
    console.log('test');
    setTimeout(() => {
        res.json({ message: 'templates post api' }).send();
    }, 2000)
});

module.exports = router;

var express = require('express');
var router = express.Router();


router.post('/maps', function(req, res, next) {


    res.json({ message: 'post map' }).send();

});

//url /api
router.get('/maps', function(req, res) {


    res.json({ message: 'get map' }).send();
});



module.exports = router;

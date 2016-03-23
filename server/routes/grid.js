var express = require('express');
var router = express.Router();


router.post('/grid', function(req, res, next) {


    res.json({ message: 'post grid' }).send();

});

//url /api
router.get('/grid', function(req, res) {


    res.json({ message: 'get grid' }).send();
});



module.exports = router;

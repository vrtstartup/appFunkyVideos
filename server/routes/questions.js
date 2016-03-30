var express = require('express');
var router = express.Router();


router.post('/questions', function(req, res, next) {


    res.json({ message: 'post question' }).send();

});

//url /api
router.get('/questions', function(req, res) {


    res.json({ message: 'get question' }).send();
});



module.exports = router;

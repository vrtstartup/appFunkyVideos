var express = require('express');
var router = express.Router();

var mapbox = process.env.MAPBOX_TOKEN;

//url /api
router.get('/env', function(req, res) {
    if(!mapbox) console.log('No mapbox token found');
    res.json({token: mapbox}).send();
});



module.exports = router;

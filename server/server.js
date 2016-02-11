var express = require('express');        // call express
var bodyParser = require('body-parser');
var path = require('path'); //part of node
var morgan = require('morgan');
var cors = require('cors');

var imagesApi = require('./images');

var app = express(); // define our app using express

app.use(cors());

app.use(morgan('dev'));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('app')); // all in app folder is publicly accessible
app.use('/temp', express.static('temp')); //temp is public
// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); // get an instance of the express Router

// all of our routes will be prefixed with /api
app.use('/api', imagesApi);

// START THE SERVER
// =============================================================================

// set our port
var port = process.env.PORT || 3000;

var server = app.listen(port, function(){
    console.log('Express server listening on port: '
        + server.address().port);
});

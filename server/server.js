const express = require('express'); // call express
const bodyParser = require('body-parser');
const path = require('path'); //part of node
const morgan = require('morgan');
const cors = require('cors');
const Boom = require('boom');
//const httpProxy = require('http-proxy');
const mkdirp = require('mkdirp');


const errorHandler = require('./middleware/errorHandler');
// const logger = require('./middleware/logger');
const imagesApi = require('./routes/images');
const subtitlesApi = require('./routes/subtitles');
const templatesApi = require('./routes/templates');
const templaterApi = require('./routes/templater');
const movieApi = require('./routes/movies');
const gridApi = require('./routes/grid');
const mapsApi = require('./routes/maps');
const questionsApi = require('./routes/questions');
const convertImageApi = require('./routes/convertimage');
const environmentVarsApi = require('./routes/environment');
const downloadApi = require('./routes/download');


//var proxy = httpProxy.createProxyServer(); // for communication between webpack & server
var app = express(); // define our app using express

app.use(morgan('dev'));

app.use(cors());


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('app')); // all in app folder is publicly accessible
app.use('/temp', express.static('temp')); //temp is public
app.use('/json', express.static('data/json')); //public json file for templater
// ROUTES FOR OUR API
// =============================================================================
//var router = express.Router(); // get an instance of the express Router

// all of our routes will be prefixed with /api
app.use('/api', imagesApi);
app.use('/api', subtitlesApi);
app.use('/api', templatesApi);
app.use('/api/movie', movieApi);
app.use('/api/templater', templaterApi);
app.use('/api', gridApi);
app.use('/api', mapsApi);
app.use('/api', questionsApi);
app.use('/api', environmentVarsApi);
app.use('/api', convertImageApi);
app.use('/api', downloadApi);




// START THE SERVER
// =============================================================================

// set our port
const env = process.env.NODE_ENV || 'development';
var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;

app.use(express.static('./app/build'));

// We only want to run the workflow when not in production
if (env === 'development') {
    var httpProxy = require('http-proxy');
    var proxy = httpProxy.createProxyServer(); // for communication between webpack & server

    console.log('DEVELOPMENT');
    // We require the bundler inside the if block because
    // it is only needed in a development environment.
    var bundle = require('./bundle.js');
    bundle();

    // Any requests to localhost:3000/build is proxied
    // to webpack-dev-server
    app.all('/build/*', function(req, res) {
        proxy.web(req, res, {
            target: 'http://localhost:8080'
        });
    });

    // It is important to catch any errors from the proxy or the
    // server will crash. An example of this is connecting to the
    // server when webpack is bundling
    proxy.on('error', function(e) {
        console.log('Could not connect to proxy, please try again...');
    });
}

createPath();

// create paths
function createPath() {
    mkdirp('temp/videos', function(err) {
        console.log('Path is created temp/videos');
        // path was created unless there was error
        if (err)
            console.log('Error while creating path:', err);

    });
    mkdirp('temp/movies', function(err) {
        console.log('Path is created temp/videos');
        // path was created unless there was error
        if (err)
            console.log('Error while creating path:', err);

    });
    mkdirp('temp/templates', function(err) {
        console.log('Path is created temp/templates');
        // path was created unless there was error
        if (err)
            console.log('Error while creating path:', err);

    });
    mkdirp('temp/subtitleVideos', function(err) {
        console.log('Path is created temp/subtitleVideos');
        // path was created unless there was error
        if (err)
            console.log('Error while creating path:', err);

    });
    mkdirp('temp/templaterVideos', function(err) {
        console.log('Path is created temp/subtitleVideos');
        // path was created unless there was error
        if (err) console.log('Error while creating path:', err);
    });
    mkdirp('temp/chart', function(err) {
        console.log('Path is created temp/chart');
        // path was created unless there was error
        if (err) console.log('Error while creating path:', err);
    });
    mkdirp('temp/downloads', function(err) {
        console.log('Path is created temp/downloads');
        // path was created unless there was error
        if (err) console.log('Error while creating path:', err);
    });
}

//
//// All other undefined routes should return 404
app.route('*').all(function(req, res, next) {
    return next(Boom.notFound());
});

//// errorHandlers
app.use(errorHandler());



var server = app.listen(port, function() {
    console.log('Express server listening on port: ' + server.address().port);
    console.log('Current environment is: ' + env);
});

var express = require('express');        // call express
var bodyParser = require('body-parser');
var path = require('path'); //part of node
var morgan = require('morgan');
var cors = require('cors');
var httpProxy = require('http-proxy');

var imagesApi = require('./routes/images');
var subtitlesApi = require('./routes/subtitles');

var proxy = httpProxy.createProxyServer(); // for communication between webpack & server
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
app.use('/api', subtitlesApi);

// START THE SERVER
// =============================================================================

// set our port
var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;

app.use(express.static('./app/build'));

// We only want to run the workflow when not in production
if (!isProduction) {

    console.log('DEVELOPMENT');
    // We require the bundler inside the if block because
    // it is only needed in a development environment.
    var bundle = require('./bundle.js');
    bundle();

    // Any requests to localhost:3000/build is proxied
    // to webpack-dev-server
    app.all('/build/*', function (req, res) {
        proxy.web(req, res, {
            target: 'http://localhost:8080'
        });
    });

}

// It is important to catch any errors from the proxy or the
// server will crash. An example of this is connecting to the
// server when webpack is bundling
proxy.on('error', function(e) {
    console.log('Could not connect to proxy, please try again...');
});


var server = app.listen(port, function(){
    console.log('Express server listening on port: '
        + server.address().port);
});

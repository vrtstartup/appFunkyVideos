const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./../webpack.config.js');
const path = require('path');
const fs = require('fs');
const mainPath = path.resolve(__dirname, '..', 'app', 'app.js');

module.exports = function () {

    // First we fire up Webpack an pass in the configuration we
    // created
    var bundleStart = null;
    var compiler = Webpack(webpackConfig);

    // We give notice in the terminal when it starts bundling and
    // set the time it started
    compiler.plugin('compile', function() {
        console.log('Bundling...');
        bundleStart = Date.now();
    });

    // We also give notice when it is done compiling, including the
    // time it took. Nice to have
    compiler.plugin('done', function() {
        console.log('Bundled in ' + (Date.now() - bundleStart) + 'ms!');
    });

    var bundler = new WebpackDevServer(compiler, webpackConfig.devServer);

    // We fire up the development server and give notice in the terminal
    // that we are starting the initial bundle
    bundler.listen(8080, 'localhost', function () {
        console.log('Bundling project, please wait...');
    });

};

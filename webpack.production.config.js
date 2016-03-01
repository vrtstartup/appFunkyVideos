var Webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var buildPath = path.resolve(__dirname, 'app', 'build');
var mainPath = path.resolve(__dirname, 'app', 'app.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


var config = {

    // We change to normal source mapping
    devtool: 'source-map',
    entry: mainPath,
    output: {
        path: buildPath,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: [nodeModulesPath],
                query: {
                    presets: ['es2015']
                }
            },{
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap!autoprefixer-loader?browsers=last 2 versions!sass?sourceMap'),
            },
            {
                test: /\.html$/,
                loader: 'raw'
            },
        ]
    },
    plugins: [
        // styles from initial chunks into separate css output file
        new ExtractTextPlugin('bundle.css'),
    ],
};

module.exports = config;
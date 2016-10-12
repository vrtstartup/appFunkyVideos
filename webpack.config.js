var Webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var buildPath = path.resolve(__dirname, 'app', 'build');
var mainPath = path.resolve(__dirname, 'app', 'app.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

console.log("DIR", __dirname);

var config = {

    // Makes sure errors in console map to the correct file
    // and line number
    // devtool: 'eval',
    devtool: ['source-map', 'eval'],
    entry: [

        // For hot style updates
        'webpack/hot/dev-server',
        './app/style.scss',

        // The script refreshing the browser on none hot updates
        'webpack-dev-server/client?http://localhost:8080',

        // Our application
        mainPath,
    ],
    output: {

        // We need to give Webpack a path. It does not actually need it,
        // because files are kept in memory in webpack-dev-server, but an
        // error will occur if nothing is specified. We use the buildPath
        // as that points to where the files will eventually be bundled
        // in production
        path: buildPath,
        filename: 'bundle.js',

        // Everything related to Webpack should go through a build path,
        // localhost:3000/build. That makes proxying easier to handle
        publicPath: '/build/'
    },
    module: {

        loaders: [

            // I highly recommend using the babel-loader as it gives you
            // ES6/7 syntax and JSX transpiling out of the box
            {
              test: /\.js$/,
              loader: 'babel',
              exclude: [nodeModulesPath],
              query: {
                  presets: ['es2015']
                }
            },
            // The url loader works like the file loader, 
            // but can return a Data Url if the file is smaller than a limit.
            // e.g if file is smaller than 10kb (=10000)
            {
                test: /\.(png)$/,
                loader: 'url-loader?limit=10000&minetype=application/font-woff',
            },
            // Uses default webpack file-loader
            // just copy-files & solve paths to './build''
            {
                test: /\.(eot|svg|eot|ttf|woff|woff2)$/,
                loader: 'file?name=app/fonts/[name].[ext]'
            },
            // Let us also add the style-loader and css-loader, which you can
            // expand with less-loader etc.
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap!autoprefixer-loader?browsers=last 2 versions!sass?sourceMap'),
            },
            // {
            //     test: /\.html$/,
            //     loader: 'raw'
            // },
            // ngtemplate loader
             {
                test: /\.html$/,
                loader: 'ngtemplate?relativeTo=' + __dirname + '/!html'
            },

        ]
    },

  // We have to manually add the Hot Replacement plugin when running
  // from Node
    plugins: [
        new Webpack.HotModuleReplacementPlugin(),

        // styles from initial chunks into separate css output file
        new ExtractTextPlugin('bundle.css'),
    ],
    devServer: {
        contentBase: './app',
        publicPath: '/build/',
        hot: true,
        quiet: false,
        noInfo: false,
        stats: {
            version: false,
            colors: true,
            chunks: false,
            children: false,
        },
    }
};

module.exports = config;

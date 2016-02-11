var webpack = require('webpack');

module.exports = {
    entry: __dirname + '/app/app.js',
    output: {
        path: __dirname + '/app/bundle',
        filename: 'bundle.js',
    },
    devtool: "source-map",
    module: {
        preLoaders: [
            // { test:/\.js$/, loader: 'eslint-loader', exclude: /(node_modules|bower_components)/},
        ],
        loaders:[
            { test:/\.js$/, loader: 'babel-loader', exclude: /(node_modules|bower_components)/ },
            { test:/\.scss$/, loader: 'style!css?sourceMap!sass?sourceMap' },
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jquery: 'jquery'
        }),
    ]
}

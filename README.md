# Funky Videos App

#### Please, use develop brunch for developing

First install all npm dependencies
`npm i`

To start app
`npm start`

To build with webpack
`webpack`

Surf to http://localhost:3000/#/ and enjoy!

#### Deploy to heroku
Install heroku toolbelt [https://toolbelt.heroku.com]
Run `webpack -p --config webpack.production.config.js` for correct production build
Then follow guidlines for deploy    


#### ffpeg
To make it work prpoperly, you should install ffmpeg locally

`brew install ffmpeg --with-fdk-aac --with-ffplay --with-freetype --with-frei0r
--with-libass --with-libvo-aacenc --with-libvorbis --with-libvpx --with-opencore-amr
--with-openjpeg --with-opus --with-rtmpdump --with-schroedinger --with-speex
--with-theora --with-tools --enable-libass`
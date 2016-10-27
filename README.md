# Funky Videos App

#### Please, use develop branch for developing

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
`git add .`
`git commit -m 'make it better'`
`git push heroku master`


#### Running production config
make sure to set following environment variables NODE_ENV=production and PORT=**

Run `webpack -p --config webpack.production.config.js` to create production /build folder in /app folder
Run 'npm start' to startup node server
  
    

#### ffmpeg
To make it work prpoperly, you should install ffmpeg locally

`brew install ffmpeg --with-fdk-aac --with-ffplay --with-freetype --with-frei0r
--with-libass --with-libvo-aacenc --with-libvorbis --with-libvpx --with-opencore-amr
--with-openjpeg --with-opus --with-rtmpdump --with-schroedinger --with-speex
--with-theora --with-tools --enable-libass`

##### missing library
`brew install <libass>`

##### oR use static build
Or copy static build off ffmpeg with libass & ffprobe into usr/local/bin
https://johnvansickle.com/ffmpeg/
https://evermeet.cx/pub/ffmpeg/snapshots/

#### dropbox access
To upload files to dropbox (templater), following environment variables should be set
export DB_KEY=***
export DB_SECRET=***
export DB_TOKEN=***


#### Git
Although some of us suck at git, we try to follow Vincent Driessen's branching model (http://nvie.com/posts/a-successful-git-branching-model/) and use git-flow for ease of use (http://danielkummer.github.io/git-flow-cheatsheet/).

//TODO: refactor show functions
export default class MoviesController {
    constructor($scope, $http, $document, Upload, $mdDialog, toast, firebaseAuth, $firebaseArray) {
        this.$scope = $scope;
        this.$http = $http;
        this.$document = $document;
        this.Upload = Upload;
        this.toast = toast;
        this.$mdDialog = $mdDialog;
        this.$firebaseArray = $firebaseArray;

        this.movie = {};
        this.movieId = '';
        this.movieClips = [];



        // this.movie.id = Date.now();

        // TODO: add dynamic bumper & logo
        // this.movie.bumper = 11;
        // this.movie.logo = 11;

        this.firebaseAuth = firebaseAuth;
        this.firebaseAuth.$onAuth((authData) => {
            if (authData) {
                this.movie.email = authData.password.email;
            }
        });

        // The reference to the firebase


        this.moviesRef = new Firebase('vrtnieuwshub.firebaseio.com/apps/stitcher/movies');
        this.movies = this.$firebaseArray(this.moviesRef);

        this.ref = '';
        this.clips = '';




        this.clipTemplates = [{
                'name': 'title',
                'description': 'De titel van het filmpje',
                'url': 'assets/stitcherTemplates/titleSlide.png',
                'aep': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\image_test_02.aep',
                'templateLocalPath': '/components/movies/movie.title.html'
            }, {
                'name': 'text',
                'description': 'Tekst op foto',
                'url': 'assets/stitcherTemplates/textSlide.png',
                'aep': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\image_test_02.aep',
                'templateLocalPath': '/components/movies/movie.text.html'
            }, {
                'name': 'number',
                'description': 'Licht 1 nummer of woord uit.',
                'url': 'assets/stitcherTemplates/numberSlide.png',
                'aep': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\image_test_02.aep',
                'templateLocalPath': '/components/movies/movie.number.html'
            }, {
                'name': 'quote',
                'description': 'Toon een quote van.',
                'url': 'assets/stitcherTemplates/quoteSlide.png',
                'aep': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\image_test_02.aep',
                'templateLocalPath': '/components/movies/movie.quote.html'
            }, {
                'name': 'icon',
                'description': 'Gebruik een icoon om iets uit te leggen.',
                'url': 'assets/stitcherTemplates/iconSlide.png',
                'aep': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\image_test_02.aep',
                'templateLocalPath': '/components/movies/movie.icon.html'
            }, {
                'name': 'tweet',
                'description': 'Toon een tweet in beeld.',
                'url': 'assets/stitcherTemplates/tweetSlide.png',
                'aep': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\image_test_02.aep',
                'templateLocalPath': '/components/movies/movie.tweet.html'
            }

        ];

        this.movieTypes = [{
            'name': 'tekst',
            'templateName': 'template_02_tekst',
            'templateLocalPath': '/components/movies/movie.tekst.html',
            'templaterPath': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\image_test_02.aep',
            'thumb': '/assets/movies-title.png'
        }];

        this.showDialogMovie();


    }



    addMovie() {

        this.movies.$add(this.movie).then((ref) => {
            this.openMovie(ref.key());
            this.initiateClip(this.clipTemplates[0].aep, 0);



            var emailRef = new Firebase('vrtnieuwshub.firebaseio.com/apps/stitcher/movies/' + this.movieId + '/email');
            emailRef.remove();



        });


    }


    openMovie(movieId) {
        this.movieId = movieId;
        this.ref = new Firebase('vrtnieuwshub.firebaseio.com/apps/stitcher/movies/' + movieId);
        this.clips = this.$firebaseArray(this.ref);



        this.$mdDialog.hide();

    }

    getInclude(template) {

        // weird bug when template = 0;
        if (template > 0) {
            return this.clipTemplates[template].templateLocalPath;
        } else {
            return this.clipTemplates[0].templateLocalPath;
        }
    }

    showDialogClip() {
        this.$mdDialog.show({
            templateUrl: '/components/movies/movie.dialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            escapeToClose: true,
            scope: this.$scope,
            preserveScope: true
        });
    }


    showDialogMovie() {
        this.$mdDialog.show({
            templateUrl: '/components/movies/movie.dialogMovies.html',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            escapeToClose: true,
            scope: this.$scope,
            preserveScope: true
        });
    }





    selectFile() {
        angular.element(this.$document[0].querySelector('#clipFile'))[0].click();
    }



    addClip() {
        this.showDialogClip();
    }







    initiateClip(template, templateKey) {
        console.log('creating a new clip with template url: ', template);

        console.log(this.ref);
        this.ref.once("value", (snapshot) => {
            var number = snapshot.numChildren();

            var clip = {
                'id': number,
                'movieId': this.movieId,
                'bot': 'render',
                'render-status': 'ready',
                'uploaded': false,
                'saved': false,
                'aep': template,
                'template': templateKey
            };

            this.clips.$add(clip).then(function(ref) {
                // console.log(ref);
            });


            // this.movieClips.push(clip);
            this.$mdDialog.hide();



        });




    }



    uploadFile(file, clipKey, key) {
        console.log(file, clipKey, key);
        this.Upload.upload({
                url: 'api/movie/upload-to-dropbox',
                data: { 'movieId': this.movie.id, 'clipId': key, file: file },
                method: 'POST'
            })
            .then((resp) => {

                console.log("RESPONSE", resp.data);

                console.log(this.clips);
                this.clips[key].img01 = resp.data.filenameIn;
                this.clips[key].img01_url = resp.data.image;
                this.clips[key].uploaded = true;
                this.clips.$save(key).then(function(ref) {});

            }, (resp) => {
                console.log('Error: ' + resp.error);
                console.log('Error status: ' + resp.status);
            }, (evt) => {
                this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
    }



    saveClip() {
        if (this.currentClip.saved) {
            return;
        }

        if (this.movieClips.length) {
            this.movieClips[this.movieClips.length - 1].img02 = this.currentClip.img01;
            console.log('setting img02 of previous clip', this.movieClips);
        }

        this.currentClip.output = this.movie.id + '/' + this.number;
        this.currentClip.last = false;
        this.currentClip.type = this.templatePath.name;
        this.currentClip.saved = true;

        this.movieClips.push(this.currentClip);
    }

    deleteClip(clip) {
        this.movieClips = reject(this.movieClips, (movieClip) => {
            return movieClip.id === clip.id;
        });
    }




    // /* start navigation */
    // changeLayout(type) {
    //     var property = type.name.replace('-', '');

    //     if (this.currentClip[property]) {
    //         delete this.currentClip[property];
    //     }

    //     this.templatePath = type;
    // }



    // resetDialog() {
    //         this.$mdDialog.hide();
    //         //reset tabindex to upload form, if reset is called we assume e-mail is valid so skip index 0.
    //         this.tabIndex = 1;
    //     }
    //     /*  end of navigation */

    // initMovie() {
    //     this.initNewClip();

    //     this.tabIndex++;
    // }

    // initNewClip() {
    //     this.progressPercentage = 0;
    //     this.number = this.number + 1;

    //     this.currentClip = {
    //         'id': this.number,
    //         'movieId': this.movie.id,
    //         'bot': 'render',
    //         'render-status': 'ready',
    //         'uploaded': false,
    //         'saved': false
    //     };
    // }



    // upload images to dropbox



    renderMovie() {
        // go through all clips and set attributes on the last one


        let counter = 1;

        angular.forEach(this.clips, (clip) => {


            this.movieClips .push(clip);

            if (counter >= this.movieClips.length) {
                clip.last = true;
                clip.email = this.movie.email;
                clip.bumper = this.movie.bumper;
                clip.logo = this.movie.logo;
            }
            counter++;
        });

        let params = {
            movieClips: this.movieClips

        };
        console.log(params);

        this.$http.post('api/movie/update-movie-json', params)
            .then(() => {
                this.toast.showToast('success', 'Uw video wordt zodra verwerkt, het resultaat wordt naar u doorgemailed.');
            });
    }
}

MoviesController.$inject = ['$scope', '$http', '$document', 'Upload', '$mdDialog', 'toast', 'firebaseAuth', '$firebaseArray'];

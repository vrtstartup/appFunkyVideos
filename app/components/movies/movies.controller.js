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

        this.aepLocation = {
            'bumper': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Apps\\VideoTemplater\\ae\\Slide_Templator\\slides-bumper\\',
            'normal': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Apps\\VideoTemplater\\ae\\Slide_Templator\\slides\\'
        };

        this.clipTemplates = [{
                'name': 'title',
                'description': 'De titel van het filmpje',
                'url': 'assets/stitcherTemplates/titleSlide.png',
                'aep': this.aepLocation.normal + 'image_template_title.aep',
                'templateLocalPath': '/components/movies/movie.title.html'
            }, {
                'name': 'text',
                'description': 'Tekst op foto',
                'url': 'assets/stitcherTemplates/textSlide.png',
                'aep': this.aepLocation.normal + 'image_template_text.aep',
                'templateLocalPath': '/components/movies/movie.text.html',
                'aepWithBumper': this.aepLocation.bumper + 'image_template_text_bumper.aep',
            }, {
                'name': 'number',
                'description': 'Licht 1 nummer of woord uit.',
                'url': 'assets/stitcherTemplates/numberSlide.png',
                'aep': this.aepLocation.normal + 'image_template_number.aep',
                'templateLocalPath': '/components/movies/movie.number.html',
                'aepWithBumper': this.aepLocation.bumper + 'image_template_number_bumper.aep',
            }, {
                'name': 'quote',
                'description': 'Toon een quote van.',
                'url': 'assets/stitcherTemplates/quoteSlide.png',
                'aep': this.aepLocation.normal + 'image_template_quote.aep',
                'templateLocalPath': '/components/movies/movie.quote.html',
                'aepWithBumper': this.aepLocation.bumper + 'image_template_quote_bumper.aep',
            },
            //  {
            //     'name': 'icon',
            //     'description': 'Gebruik een icoon om iets uit te leggen.',
            //     'url': 'assets/stitcherTemplates/iconSlide.png',
            //     'aep': this.aepLocation.normal + 'image_template_icon.aep',
            //     'templateLocalPath': '/components/movies/movie.icon.html',
            //     'aepWithBumper': this.aepLocation.bumper + 'image_template_icon_bumper.aep',
            // },
            //  {
            //     'name': 'tweet',
            //     'description': 'Toon een tweet in beeld.',
            //     'url': 'assets/stitcherTemplates/tweetSlide.png',
            //     'aep': this.aepLocation.normal + 'image_template_tweet.aep',
            //     'templateLocalPath': '/components/movies/movie.tweet.html',
            //     'aepWithBumper': this.aepLocation.bumper + 'image_template_tweet_bumper.aep',
            // }

        ];

        this.movieTypes = [{
            'name': 'tekst',
            'templateName': 'template_02_tekst',
            'templateLocalPath': '/components/movies/movie.tekst.html',
            'templaterPath': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\image_test_02.aep',
            // 'templaterPathWithBumper': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\image_test_02.aep',
            'thumb': '/assets/movies-title.png'
        }];

        this.showDialogMovie();


        $scope.$watch(
            'vm.upload',
            function handleFooChange(newValue, oldValue) {
                // this.uploadFile(this.upload);
            }
        );


        // this.$watch('upload', function() {
        //     this.uploadFile(this.upload);
        // });


    }

    addMovie() {
        this.movies.$add(this.movie).then((ref) => {
            this.openMovie(ref.key());
            this.initiateClip(this.clipTemplates[0].aep, 0, 'title');

            var emailRef = new Firebase('vrtnieuwshub.firebaseio.com/apps/stitcher/movies/' + this.movieId + '/email');
            var onComplete = function(error) {
                if (error) {
                    console.log('Synchronization failed');
                } else {
                    console.log('Synchronization succeeded');
                }
            };
            emailRef.remove(onComplete);
            this.openMovie(ref.key());

        });
    }

    openMovie(movieId) {
        this.movieId = movieId;
        this.ref = new Firebase('vrtnieuwshub.firebaseio.com/apps/stitcher/movies/' + movieId);
        var clips = this.$firebaseArray(this.ref);
        this.clips = clips;
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



    addClip() {
        this.showDialogClip();
    }

    initiateClip(template, templateKey, type) {

        this.ref.once("value", (snapshot) => {
            var number = '';
            if (type === 'title') {
                number = 1;
            } else {
                number = snapshot.numChildren() + 1;
            }

            var clip = {
                'id': number,
                'last': false,
                'movieId': this.movieId,
                'bot': 'render',
                'render-status': 'ready',
                'uploaded': false,
                'saved': false,
                'aep': template,
                'template': templateKey,
                'output': this.movieId + '/' + number
            };

            this.clips.$add(clip).then(function(ref) {

            });
            this.$mdDialog.hide();

        });
    }

    selectFile(clipKey, key) {
        this.clipKey = clipKey;
        this.key = key;
        angular.element(this.$document[0].querySelector('#clipFile'))[0].click();
    }




    uploadFile(file, clipKey, key) {
        this.clips[key].uploading = true;

        this.Upload.upload({
                url: 'api/movie/upload-to-dropbox',
                data: { 'movieId': this.movieId, 'clipId': key, file: file },
                method: 'POST'
            })
            .then((resp) => {

                console.log("RESPONSE", resp.data);

                console.log(this.clips);
                this.clips[key].img01 = resp.data.filenameIn;
                this.clips[key].img01_url = resp.data.image;

                this.clips[key].uploading = false;


                // Add the image as the second image for the previous slide

                    this.clips[key - 1].img02 = resp.data.filenameIn;
                    console.log(this.clips[key - 1]);


                this.clips.$save(key).then(function(ref) {

                });



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

    renderMovie() {
        // go through all clips and set attributes on the last one
        let counter = 1;
        angular.forEach(this.clips, (clip) => {

            this.movieClips.push(clip);

            if (counter >= this.clips.length) {
                clip.last = true;
                clip.email = this.movie.email;

                for (var i = 0; i < this.clipTemplates.length; i++) {
                    if (i === clip.template) {
                        clip.aep = this.clipTemplates[i].aepWithBumper;
                    }
                }
            }

            counter++;
        });

        let params = {
            movieClips: this.movieClips
        };

        this.$http.post('api/movie/update-movie-json', params)
            .then(() => {
                console.log('json updated');
                this.toast.showToast('success', 'Uw video wordt zodra verwerkt, het resultaat wordt naar u doorgemailed.');
            });
    }
}

MoviesController.$inject = ['$scope', '$http', '$document', 'Upload', '$mdDialog', 'toast', 'firebaseAuth', '$firebaseArray'];

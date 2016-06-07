//TODO: refactor show functions
export default class MoviesController {
    constructor($scope, $http, $document, Upload, $mdDialog, toast, firebaseAuth, $firebaseArray, userManagement, $q) {
        this.$scope = $scope;
        this.$http = $http;
        this.$document = $document;
        this.Upload = Upload;
        this.toast = toast;
        this.$mdDialog = $mdDialog;
        this.$firebaseArray = $firebaseArray;
        this.userManagement = userManagement;
        this.$q = $q;

        this.movie = {};
        this.movieId = '';
        this.movieClips = [];

        this.root = 'D:\\videoTemplater\\dropbox\\';


        this.firebaseAuth = firebaseAuth;


        this.firebaseAuth.$onAuth((authData) => {
            if (authData) {
                this.userManagement.checkAccountStatus(authData.uid).then((obj, message, error) => {
                    this.userBrand = obj.brand;
                    this.userEmail = authData.password.email;
                    this.movie = [{
                        'email': this.userEmail,
                        'brand': this.userBrand
                    }];
                });
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
                'brand': 'deredactie.be',
                'description': 'De titel van het filmpje',
                'url': 'assets/stitcherTemplates/titleSlide.png',
                'aep': this.aepLocation.normal + 'image_template_title.aep',
                'templateLocalPath': '/components/movies/movie.title.html'
            }, {
                'name': 'text',
                'brand': 'deredactie.be',
                'description': 'Tekst op foto',
                'url': 'assets/stitcherTemplates/textSlide.png',
                'aep': this.aepLocation.normal + 'image_template_text.aep',
                'templateLocalPath': '/components/movies/movie.text.html',
                'aepWithBumper': this.aepLocation.bumper + 'image_template_text_bumper.aep',
            }, {
                'name': 'number',
                'brand': 'deredactie.be',
                'description': 'Licht 1 nummer of woord uit.',
                'url': 'assets/stitcherTemplates/numberSlide.png',
                'aep': this.aepLocation.normal + 'image_template_number.aep',
                'templateLocalPath': '/components/movies/movie.number.html',
                'aepWithBumper': this.aepLocation.bumper + 'image_template_number_bumper.aep',
            }, {
                'name': 'quote',
                'brand': 'deredactie.be',
                'description': 'Toon een quote.',
                'url': 'assets/stitcherTemplates/quoteSlide.png',
                'aep': this.aepLocation.normal + 'image_template_quote.aep',
                'templateLocalPath': '/components/movies/movie.quote.html',
                'aepWithBumper': this.aepLocation.bumper + 'image_template_quote_bumper.aep',
            }, {
                'name': 'title',
                'brand': 'sporza',
                'description': 'De titel van het filmpje',
                'url': 'assets/stitcherTemplates/titleSlide.png',
                'aep': this.aepLocation.normal + 'image_template_title.aep',
                'templateLocalPath': '/components/movies/movie.title.html'
            }, {
                'name': 'quote',
                'brand': 'sporza',
                'description': 'Toon een quote.',
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


    }

    createMovie() {
        this.movies.$add(this.movie).then((ref) => {
            this.openMovie(ref.key());
            var titleTemplate = '';
            angular.forEach(this.clipTemplates, (template) => {
                console.log(template.brand, this.userBrand, template.brand === this.userBrand);
                if (template.brand === this.userBrand && template.name === 'title') {
                    console.log(template);
                    titleTemplate = template.aep;
                    this.initiateClip(titleTemplate, 0, 'title');
                    this.openMovie(ref.key());
                }

            });
        });
    }

    openMovie(movieId) {
        console.log(movieId);
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

    addClip() {
        this.showDialogClip();
    }

    initiateClip(template, templateKey, type) {

        this.ref.once("value", (snapshot) => {
            var number = '';
            if (type === 'title') {
                number = 1;
            } else {
                number = snapshot.numChildren();
            }

            var clip = {
                'id': number,
                // 'last': false,
                'movieId': this.movieId,
                // 'bot': 'render',
                // 'render-status': 'ready',
                'uploaded': false,
                'uploading': false,
                'saved': false,
                'aep': template,
                'template': templateKey,
                // 'output': this.movieId + '/' + number
            };
            this.clips.$add(clip).then((ref) => {
                this.$mdDialog.hide();
            });

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
                console.log(resp);
                console.log(clipKey, key);
                this.clips[key].img01 = resp.data.filenameIn;
                this.clips[key].img01_url = resp.data.image;
                this.clips[key].uploading = false;
                this.clips.$save(key).then((ref) => {});


                // Add the image as the second image for the previous slide
                // This can actually be done when we create the json for the templater.
                if ((key * 1) - 1 !== 0) {
                    console.log('test');


                    this.clips[(key * 1) - 1].img02 = resp.data.filenameIn;
                    this.clips.$save((key * 1) - 1).then((ref) => {

                    });
                }

            }, (resp) => {
                console.log('Error: ' + resp.error);
                console.log('Error status: ' + resp.status);



            }, (evt) => {
                this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
    }

    // saveClip() {
    //     if (this.currentClip.saved) {
    //         return;
    //     }

    //     if (this.movieClips.length > 1) {
    //         this.movieClips[this.movieClips.length - 1].img02 = this.currentClip.img01;
    //         console.log('setting img02 of previous clip', this.movieClips);
    //     }

    //     this.currentClip.output = this.movie.id + '/' + this.number;
    //     this.currentClip.last = false;
    //     this.currentClip.type = this.templatePath.name;
    //     this.currentClip.saved = true;

    //     this.movieClips.push(this.currentClip);
    // }


    createFFMPEGLine(clips) {
        const deferred = this.$q.defer();

        const outFolder = this.root + 'out\\' + this.movieId + '\\';
        const inFolder = this.root + 'in\\';
        const fin = this.root + 'finished\\' + this.movieId + '.mp4';
        const finWithLogo = this.root + 'finished\\' + this.movieId + '-logo.mp4';
        const input = inFolder + this.clips[0].movieName;



        let ffmpegLine = '';

        let total = parseInt(clips.length);


        let clipsToConcat = '';
        let listClips = '';

        angular.forEach(clips, (clip) => {
            let clipId = parseInt(clip.id);
            clipsToConcat = clipsToConcat + ' -i ' + outFolder + clip.id + '.avi';

            let clipMinusOne = clipId-1;
            listClips = listClips + '[' + clipMinusOne + '] ';
            if (clipId === total) {
                ffmpegLine = 'ffmpeg' + clipsToConcat + ' -filter_complex \"\"' + listClips + 'concat=n=' + total + ':v=1[out]\"\" -map [out] ' + fin;
                deferred.resolve(ffmpegLine);
            }
        });
        return deferred.promise;
    }


    sendToTemplater(clips) {
        console.log(clips);
        let params = {
            movieClips: clips
        };


        this.$http.post('api/movie/update-movie-json', params)
            .then(() => {
                console.log('json updated');
                this.toast.showToast('success', 'Uw video wordt zodra verwerkt, het resultaat wordt naar u doorgemailed.');
            });
    }



    renderMovie() {


        // go through all clips and set attributes on the last one
        let counter = 1;
        let ffmpegLine = '';
        this.movieClips = [];
        angular.forEach(this.clips, (clip) => {

            if (clip.$id !== '0' && clip.id !== this.clips.length - 1) {
                console.log(counter);
                // clip.id = counter;
                clip['render-status'] = 'ready';
                clip.bot = 'render';
                clip.last = 'false';

                clip.output = this.movieId + '/' + counter;
                // clip.module = 'jpg2000';
                this.movieClips.push(clip);
                counter++;
            }

            if (clip.$id !== '0' && clip.id === this.clips.length - 1) {
                clip['render-status'] = 'ready';
                clip.bot = 'render';
                clip.last = true;
                clip.email = this.userEmail;
                clip.output = this.movieId + '/' + counter;

                for (var i = 0; i < this.clipTemplates.length; i++) {

                    if (i === clip.template) {

                        clip.aep = this.clipTemplates[i].aepWithBumper;

                        this.movieClips.push(clip);

                        this.createFFMPEGLine(this.movieClips).then((resp) => {
                            clip.ffmpeg = resp;
                            this.sendToTemplater(this.movieClips);
                        });
                    }
                }
            }


        });

    }
}

MoviesController.$inject = ['$scope', '$http', '$document', 'Upload', '$mdDialog', 'toast', 'firebaseAuth', '$firebaseArray', 'userManagement', '$q'];

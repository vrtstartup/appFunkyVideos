//TODO: refactor show functions
export default class MoviesController {
    constructor($scope, $document, Upload, $mdDialog, firebaseAuth, $firebaseArray, $firebaseObject, userManagement, templater) {
        this.$scope = $scope;
        this.$document = $document;
        this.Upload = Upload;
        this.$mdDialog = $mdDialog;
        this.$firebaseArray = $firebaseArray;
        this.$firebaseObject = $firebaseObject;
        this.userManagement = userManagement;
        this.templater = templater;


        this.movie = {
            meta: {
                'audio': 0,
                'logo': 0,
                'bumper': 0
            }
        };

        this.movieClips = [];

        this.firebaseAuth = firebaseAuth;

        this.firebaseAuth.$onAuth((authData) => {
            if (authData) {
                this.userManagement.checkAccountStatus(authData.uid).then((obj, message, error) => {
                    this.movie.meta.email = authData.password.email;
                    this.movie.meta.brand = obj.brand;
                });
            }
        });

        this.ref = new Firebase('vrtnieuwshub.firebaseio.com/apps/stitcher/movies');
        this.movies = this.$firebaseArray(this.ref);

        // Move this to service <-
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

        // -> End service

    }

    createMovie(movie) {
        this.movies.$add(movie).then((ref) => {
            this.openMovie(ref.key());
            let titleTemplate = '';
            angular.forEach(this.clipTemplates, (template) => {
                if (template.brand === movie.meta.brand && template.name === 'title') {
                    console.log('add title clip');
                    this.initiateClip(template.aep, 0, 'title');
                }
            });
        });
    }

    openMovie(movieId) {
        let clipsRef = this.ref.child(movieId);
        this.clips = this.$firebaseArray(clipsRef);
        this.refMeta = clipsRef.child('meta');
        this.meta = this.$firebaseObject(this.refMeta);
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

        let number = '';
        if (type === 'title') {
            number = 1;
        } else {
            number = this.clips.length;
        }

        console.log(number);

        var clip = {
            'id': number,
            'uploading': false,
            'saved': false,
            'aep': template,
            'template': templateKey,
        };

        this.clips.$add(clip).then((ref) => {
            this.$mdDialog.hide();
        });
    }


    enumerate() {
        let counter = 1;
        angular.forEach(this.clips, (clip) => {

            if (clip.$id !== 'meta') {

                clip.id = counter;
                console.log(clip);
                var clip = this.clips.$getRecord(clip.$id);
                this.clips.$save(clip).then((ref) => {});
                counter++;
            }
        });
    }

    remove(clip) {
        var clip = this.clips.$getRecord(clip.$id);
        this.clips.$remove(clip).then((ref) => {
            this.enumerate();
        });


    }

    moveUp(key, c) {
        // this.enumerate();
        let to = c.id - 1;
        let from = c.id;
        console.log(from, to);
        this.clips.splice(to, 0, this.clips.splice(from, 1)[0]);
        this.enumerate();
    }

    selectFile(clipKey, key) {
        this.clipKey = clipKey;
        this.key = key;
        angular.element(this.$document[0].querySelector('#clipFile'))[0].click();
    }




    uploadFile(file, key, number) {
        var clip = this.clips.$getRecord(key);


        clip.uploading = true;
        this.Upload.upload({
                url: 'api/movie/upload-to-dropbox',
                data: { file: file },
                method: 'POST'
            })
            .then((resp) => {
                clip.img01 = resp.data.filenameIn;
                clip.img01_url = resp.data.image;
                clip.uploading = false;
                this.clips.$save(number).then((ref) => {});

                // Add the image as the second image for the previous slide
                // This can actually be done when we create the json for the templater.
                if ((number * 1) - 1 !== 0) {
                    this.clips[(number * 1) - 1].img02 = resp.data.filenameIn;
                    this.clips.$save((number * 1) - 1).then((ref) => {});
                }

            }, (resp) => {
                console.log('Error: ' + resp.error);
                console.log('Error status: ' + resp.status);
            }, (evt) => {
                this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
    }


    renderMovie(clips, meta, root) {
        // go through all clips and set attributes on the last one
        let counter = 1;
        let project = this.templater.time() + '_' + (this.meta.email.substring(0, this.meta.email.indexOf("@"))).replace('.', '');
        let readyClips = [];
        let ffmpeg = '';
        let state = '';

        angular.forEach(this.clips, (clip) => {
            if (clip.$id !== 'meta') {
                clip['render-status'] = 'ready';
                clip.bot = 'render';
                clip.output = project + '/clips/' + counter;
                this.readyClips.push(clip);
                clip.email = this.userEmail;

                if (clip.id === this.clips.length - 1) {
                    // Add attributes specific for the last one
                    clip.last = true;
                    // Loop through templates and add the template with the bumper for the last one
                    for (var i = 0; i < this.clipTemplates.length; i++) {
                        if (i === clip.template) {
                            clip.aep = this.clipTemplates[i].aepWithBumper;
                            // Create the ffmpegline
                            this.templater.stitcher(readyClips, meta, root, project).then((resp) => {
                                ffmpeg = resp.ffmpeg;
                                state = resp.state;
                                this.templater.addLogo(ffmpeg, this.meta.logo, root, project, state).then((resp) => {
                                    ffmpeg = resp.ffmpeg;
                                    state = resp.state;
                                    this.templater.addAudio(ffmpeg, this.meta.audio, root, project, state).then((resp) => {
                                        clip.ffmpeg = ffmpeg;
                                        this.templater.send(readyClips);
                                    });
                                });
                            });
                        }
                    }
                }
                counter++;
            }
        });

    }
}

MoviesController.$inject = ['$scope', '$document', 'Upload', '$mdDialog', 'firebaseAuth', '$firebaseArray', '$firebaseObject', 'userManagement', 'templater'];

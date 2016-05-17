export default class ExplainersController {
    constructor($scope, $http, $document, Upload, toast, firebaseAuth, $firebaseArray, userManagement, videogular, $q) {

        this.$scope = $scope;
        this.$http = $http;
        this.$document = $document;
        this.Upload = Upload;
        this.toast = toast;
        this.$firebaseArray = $firebaseArray;
        this.userManagement = userManagement;
        this.videogular = videogular;
        this.$q = $q;

        this.activeTab = 1;
        this.clips = '';
        this.file = {};
        this.movieClips = [];
        this.movieId = '';
        this.movieUploadStatus = 'none';
        this.movieUrl = '';
        this.movieSubmitted = false;
        this.progressPercentage = '';
        this.ref = '';

        this.aepLocation = 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Apps\\VideoTemplater\\ae\\Video_Templator\\AE\\';

        this.clipTemplates = [{
            'name': 'centraal',
            'id': 0,
            'brand': 'deredactie.be',
            'url': 'assets/stitcherTemplates/titleSlide.png',
            'aep': this.aepLocation + 'image_template_title.aep',
            'form': '/components/explainers/explainers.centercenter.form.html',
            'view': '/components/explainers/explainers.centercenter.view.html',
            'length': 3
        }, {
            'name': 'links beneden',
            'id': 1,
            'brand': 'deredactie.be',
            'url': 'assets/stitcherTemplates/titleSlide.png',
            'aep': this.aepLocation + 'image_template_title.aep',
            'form': '/components/explainers/explainers.leftbottom.form.html',
            'view': '/components/explainers/explainers.leftbottom.view.html',
            'length': 3
        }];

        // Place in Firebase where we save the explainers.
        this.moviesRef = new Firebase('vrtnieuwshub.firebaseio.com/apps/explainers');
        // Make it available to the dom as an array
        this.movies = this.$firebaseArray(this.moviesRef);

        // Authtenticate the user
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
    }

    addClip() {
        var clip = {
            'movieId': this.movieId,
            'start': 0
        };
        this.clips.$add(clip).then((ref) => {});
    }


    checkAuth() {
        const deferred = this.$q.defer();
        let message = '';
        this.firebaseAuth.$onAuth((authData) => {
            if (authData !== null) {
                deferred.resolve(authData.uid);
            } else {
                deferred.reject('not authenticated');
            }
        });
        return deferred.promise;
    }


    createFFMPEGLine() {
        const deferred = this.$q.defer();
        const movieFolder = 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Apps\\VideoTemplater\\in\\';
        const footageFolder = 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Apps\\VideoTemplater\\out\\';
        const outputFolder = 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Apps\\VideoTemplater\\finished\\';

        const input = movieFolder + this.clips[0].movieName;

        let ffmpegLine = 'ffmpeg -i ' + input;

        let clipsToOverlay = '';
        let clipsTiming = '"[0:v]setpts=PTS-STARTPTS[v0];';
        let clipOverlaying = '';
        let counter = 1;

        angular.forEach(this.movieClips, (clip) => {
            if (clip.id <= this.clips.length) {
                clipsToOverlay = clipsToOverlay + ' -i ' + footageFolder + clip.id + '.avi';
                clipsTiming = clipsTiming + '[' + clip.id + ':v]setpts=PTS-STARTPTS+' + clip.start + '/TB[v' + clip.id + '];';
                clipOverlaying = clipOverlaying + '[v' + clip.id - 1 + '][v' + clip.id + ']overlay=w[c' + clip.id + ']';
            }
            if (clip.id == this.clips.length - 1) {
                clipsToOverlay = clipsToOverlay + ' -filter_complex ';
                clipOverlaying = clipOverlaying + '[v' + clip.id - 1 + '][v' + clip.id + ']overlay=[out]';
                ffmpegLine = ffmpegLine + clipsToOverlay + clipsTiming + ' -map "[out]" ' + outputFolder + 'out.mp4';
                deferred.resolve(ffmpegLine);
            }
            counter++;
        });
        return deferred.promise;
    }

    // get the html form that belongs with this template
    getInclude(type, template) {
        // weird bug when template = 0;
        if (type === 'form') {
            if (template > 0) {
                return this.clipTemplates[template].form;
            } else {
                return this.clipTemplates[0].form;
            }
        } else if (type === 'view') {
            if (template > 0) {
                return this.clipTemplates[template].view;
            } else {
                return this.clipTemplates[0].view;
            }
        }
    }


    goToTime(t) {
        this.videogular.api.seekTime(t);


    }


    openMovie(movieId) {
        this.movieUploadStatus = 'none';
        this.movieId = movieId;
        this.ref = new Firebase('vrtnieuwshub.firebaseio.com/apps/explainers/' + movieId);
        var clips = this.$firebaseArray(this.ref);

        clips.$loaded(
            (resp) => {
                this.clips = clips;
                this.activeTab = 1;
                if (clips[0].movieUrl) {
                    this.movieUploadStatus = 'uploaded';
                    this.movieUrl = clips[0].movieUrl;
                }
            },
            (error) => {
                console.error("Error:", error);
            });
    }

    renderMovie() {
        let counter = 1;
        let ffmpegLine = '';
        this.movieClips = [];


        angular.forEach(this.clips, (clip) => {
            if (clip.$id !== '0') {

                // var clip = {
                //     'id': counter,
                //     'last': false,
                //     'movieId': this.movieId,
                //     'bot': 'render',
                //     'render-status': 'ready',
                //     'uploaded': false,
                //     'saved': false,
                //     'aep': template,
                //     'template': templateKey,
                //     'output': this.movieId + '/' + number
                // };

                clip.id = counter;
                clip['render-status'] = 'ready';
                clip.bot = 'render';
                clip.last = 'false';
                clip.output = this.movieId + '/' + counter;

                this.movieClips.push(clip);

                if (clip.$id !== '0' && counter == this.clips.length - 1) {
                    this.createFFMPEGLine().then((resp) => {
                        ffmpegLine = resp;
                        this.sendToTemplater(ffmpegLine);
                    });
                }
                counter++;
            }
        });
    }

    saveTemplateToClip(clip, template) {
        this.clips[clip].length = template.length;
        this.clips[clip].template = template.id;
        this.clips[clip].aep = template.aep;
        this.clips.$save(clip);
    }


    sendToTemplater(ffmpegLine) {
        console.log('sending to templater');

        // go through all clips and set attributes on the last one
        let counter = 1;

        angular.forEach(this.movieClips, (clip) => {
            if (counter === this.clips.length - 1) {
                clip.last = true;
                clip.email = this.clips[0].email;
                clip.movie = this.clips[0].movieName;
                // clip.ffmpeg = ffmpegLine;


            }
            counter++;
        });
        let params = {
            movieClips: this.movieClips
        };

        console.log(params);

        this.$http.post('api/movie/update-movie-json', params)
            .then(() => {
                console.log('json updated');
                this.toast.showToast('success', 'Uw video wordt zodra verwerkt, het resultaat wordt naar u doorgemailed.');
            });

    }

    // Happens when the slider get dragged
    setTime(c) {
        // Set the video to the correct time
        if (c.start) {
            console.log(c.start);
            this.videogular.api.seekTime(c.start);
        }
        // Immediately change save to firebase
        this.clips.$save(c);
    }

    // Start a new movie
    startMovie() {
        this.movies.$add(this.movie).then((ref) => {
            this.openMovie(ref.key());
        });
    }

    upload(file) {
        var movieDuration = 0;
        this.movieUploadStatus = 'uploading';

        //get duration of video
        this.Upload.mediaDuration(file).then((durationInSeconds) => {
            movieDuration = Math.round(durationInSeconds * 1000) / 1000;
        });

        // upload to dropbox
        this.Upload.upload({
                url: 'api/movie/upload-to-dropbox',
                data: { 'movieId': this.movieId, file: file },
                method: 'POST'
            })
            .then((resp) => {
                this.clips[0].movieName = resp.data.filenameIn;
                this.clips[0].movieUrl = resp.data.image;
                this.clips[0].movieDuration = movieDuration;
                this.clips.$save(0).then((ref) => {
                    this.movieUploadStatus = 'uploaded';
                });

            }, (resp) => {
                console.log('Error: ' + resp.error);
                console.log('Error status: ' + resp.status);
            }, (evt) => {
                this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
    }

}

ExplainersController.$inject = ['$scope', '$http', '$document', 'Upload', 'toast', 'firebaseAuth', '$firebaseArray', 'userManagement', 'videogular', '$q'];

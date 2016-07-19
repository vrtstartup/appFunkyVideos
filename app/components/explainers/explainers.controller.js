export default class ExplainersController {
    constructor($scope, $sce, $document, Upload, $firebaseAuth, $firebaseArray, $firebaseObject, userManagement, videogular, templater, toast) {

        this.$scope = $scope;
        this.$sce = $sce;
        this.$document = $document;
        this.Upload = Upload;
        this.$firebaseArray = $firebaseArray;
        this.$firebaseObject = $firebaseObject;
        this.userManagement = userManagement;
        this.videogular = videogular;
        this.toast = toast;
        this.templater = templater;
        this.audioTracks = this.templater.audioTracks;
        this.logos = this.templater.logos;

        this.activeTab = 1;
        this.uploading = false;
        this.clips = '';
        this.movie = {
            meta: {
                'audio': 0,
                'logo': 0,
                'bumper': 1,
                'movieUrl': ''
            }
        };

        this.progressPercentage = '';
        this.ref = firebase.database().ref().child('apps/explainers/');


        this.movies = this.$firebaseArray(this.ref);


        // Move this to service <-
        this.root = 'D:\\videoTemplater\\dropbox\\';
        this.aepLocation = this.root + 'ae\\Video_Templator\\AE\\';


        this.clipTemplates = [{
            'name': 'Titel',
            'id': 0,
            'brand': 'deredactie.be',
            'img': 'assets/videoTemplates/Still_title.jpg',
            'aep': this.aepLocation + 'Template_Text_title.aep',
            'form': '/components/explainers/explainers.centercenter.form.html',
            'view': '/components/explainers/explainers.centercenter.view.html',
            'length': 5
        }, {
            'name': 'links beneden',
            'id': 1,
            'brand': 'deredactie.be',
            'img': 'assets/videoTemplates/still_bottom.jpg',
            'aep': this.aepLocation + 'Template_Text.aep',
            'form': '/components/explainers/explainers.leftbottom.form.html',
            'view': '/components/explainers/explainers.leftbottom.view.html',
            'length': 8
        }, {
            'name': 'links boven',
            'id': 2,
            'brand': 'deredactie.be',
            'img': 'assets/videoTemplates/Still_top.jpg',
            'aep': this.aepLocation + 'Template_Text_top.aep',
            'form': '/components/explainers/explainers.lefttop.form.html',
            'view': '/components/explainers/explainers.lefttop.view.html',
            'length': 8
        }];




        // -> End service

        // Authenticate the user
        this.firebaseAuth = $firebaseAuth();
        this.firebaseAuth.$onAuthStateChanged((authData) => {
            if (authData) {
                this.userManagement.checkAccountStatus(authData.uid).then((obj, message, error) => {
                    this.email = authData.email;
                    this.movie.meta.email = authData.email;
                    this.movie.meta.brand = obj.brand;
                });
            }
        });
    }

    // Add one clip
    addClip() {
        var clip = {
            'start': 0
        };
        this.clips.$add(clip).then((ref) => {});
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

    // Make the video follow when the range gets dragged
    goToTime(t) {
        this.videogular.api.seekTime(t);
    }

    // Opening movie, after create, of when you click in the list with projects
    openMovie(movieId) {
        this.bumper = this.movie.bumper;
        this.uploading = false;

        let clipsRef = this.ref.child(movieId);
        this.clips = this.$firebaseArray(clipsRef);

        this.refMeta = clipsRef.child('meta');
        this.meta = this.$firebaseObject(this.refMeta);

        this.clips.$loaded(
            (resp) => {
                this.activeTab = 1;
            },
            (error) => {
                console.error("Error:", error);
            });
    }

    saveTemplateToClip(clip, template) {
        this.clips[clip].length = template.length;
        this.clips[clip].template = template.id;
        this.clips[clip].aep = template.aep;
        this.clips.$save(clip);
    }


    renderMovie(clips, meta, root) {

        let counter = 1;
        let project = this.templater.time() + '_' + (this.meta.email.substring(0, this.meta.email.indexOf("@"))).replace('.', '');
        let readyClips = [];
        let ffmpeg = '';
        let state = '';
        angular.forEach(clips, (clip) => {
            if (clip.$id !== 'meta') {

                clip.id = counter;
                clip['render-status'] = 'ready';
                clip.bot = 'render';
                clip.last = 'false';
                clip.output = project + '/clips/' + counter;
                clip.module = 'jpg2000';
                clip.email = this.meta.email;

                readyClips.push(clip);
                // this is the last one
                if (counter == this.clips.length - 1) {
                    // Add attributes specific for the last one
                    clip.last = true;
                    // Create the ffmpegline
                    this.templater.overlays(readyClips, meta, project).then((resp) => {

                        ffmpeg = resp.ffmpeg;
                        state = resp.state;
                        this.templater.addLogo(ffmpeg, this.meta.logo, project, state).then((resp) => {
                            console.log('step 2');
                            ffmpeg = resp.ffmpeg;
                            state = resp.state;
                            this.templater.addBumper(ffmpeg, this.meta.bumper, meta.movieDuration, project, state).then((resp) => {
                                console.log('step 3');
                                ffmpeg = resp.ffmpeg;
                                state = resp.state;
                                this.templater.addAudio(ffmpeg, this.meta.audio, project, state).then((resp) => {
                                    clip.ffmpeg = ffmpeg;
                                    console.log(readyClips);
                                    this.templater.send(readyClips);

                                });
                            });
                        });
                    });
                }
                counter++;
            }
        });
    }

    // Happens when the dropdown of the audio is changed.
    setAudio(audioId) {
        this.meta.audio = audioId;
        this.audioTrackUrl = this.templater.audioTracks[audioId].fileLocal;
        this.meta.$save().then(function(ref) {}, function(error) {
            console.log("Error:", error);
        });
    }

    // Service, cuz needed for all tools
    removeMovie(movieId, owner) {

        if (this.email === owner) {
            var movie = this.movies.$getRecord(movieId);
            this.movies.$remove(movie).then((ref) => {});
        } else {
            this.toast.showToast('error', 'Dit is niet jouw filmpje, dus kan je het ook niet verwijderen.');
        }
    }

    // Happens when the logo is changed.
    setLogo(logoId) {
        this.meta.logo = logoId;
        this.logoUrl = this.logos[logoId].fileLocal;
        this.meta.$save().then(function(ref) {}, function(error) {
            console.log("Error:", error);
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
    createMovie() {
        this.movie.createdAt = this.templater.time();
        this.movies.$add(this.movie).then((ref) => {
            this.openMovie(ref.key);
        });
    }

    // Upload the video
    upload(file) {
        let movieDuration = 0;
        this.uploading = true;

        //get duration of video
        this.Upload.mediaDuration(file).then((durationInSeconds) => {
            movieDuration = Math.round(durationInSeconds * 1000) / 1000;
            console.log(movieDuration);
        });

        // upload to dropbox
        this.Upload.upload({
                url: 'api/movie/upload-to-dropbox',
                data: { file: file },
                method: 'POST'
            })
            .then((resp) => {
                this.meta.movieName = resp.data.filenameIn;
                this.meta.movieUrl = resp.data.image;
                this.meta.movieDuration = movieDuration;
                this.meta.$save().then((ref) => {
                }, (error) => {
                    console.log("Error:", error);
                });
            }, (resp) => {
                console.log('Error: ' + resp.error);
                console.log('Error status: ' + resp.status);
            }, (evt) => {
                this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
    }
}

ExplainersController.$inject = ['$scope', '$sce', '$document', 'Upload', '$firebaseAuth', '$firebaseArray', '$firebaseObject', 'userManagement', 'videogular', 'templater', 'toast'];

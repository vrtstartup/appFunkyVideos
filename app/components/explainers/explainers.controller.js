export default class ExplainersController {
    constructor($scope, $sce, $http, $document, Upload, toast, firebaseAuth, $firebaseArray, userManagement, videogular, $q) {

        this.$scope = $scope;
        this.$http = $http;
        this.$document = $document;
        this.Upload = Upload;
        this.toast = toast;
        this.$firebaseArray = $firebaseArray;
        this.userManagement = userManagement;
        this.videogular = videogular;
        this.$q = $q;
        this.$sce = $sce;
        this.activeTab = 1;
        this.clips = '';
        this.file = {};
        this.movieClips = [];
        this.movieId = '';
        this.movie = {
            'audio': 0,
            'logo': 0
        };
        this.movieUploadStatus = 'none';
        this.movieUrl = '';
        this.movieSubmitted = false;
        this.progressPercentage = '';
        this.ref = '';
        this.audioTrack = 0;
        this.selectedLogo = 0;

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

        this.audioTracks = [{
            'name': 'geen',
            'id': 0,
            'brand': 'deredactie.be',
            'length': 'nvt',
            'fileLocal': 'nvt',
            'fileRemote': 'nvt'
        }, {
            'name': '1',
            'id': 1,
            'brand': 'deredactie.be',
            'length': '02:54',
            'fileLocal': 'assets/audio/deredactiebe/1.mp3',
            'fileRemote': this.root + 'audio\\1.wav'
        }, {
            'name': '2',
            'id': 2,
            'brand': 'deredactie.be',
            'length': '01:23',
            'fileLocal': 'assets/audio/deredactiebe/2.mp3',
            'fileRemote': this.root + 'audio\\2.wav'
        }, {
            'name': '3',
            'id': 3,
            'brand': 'deredactie.be',
            'length': '01:23',
            'fileLocal': 'assets/audio/deredactiebe/3.mp3',
            'fileRemote': this.root + 'audio\\3.wav'
        }, {
            'name': '4',
            'id': 4,
            'brand': 'deredactie.be',
            'length': '01:23',
            'fileLocal': 'assets/audio/deredactiebe/4.mp3',
            'fileRemote': this.root + 'audio\\4.wav'
        }, {
            'name': '5',
            'id': 5,
            'brand': 'deredactie.be',
            'length': '01:23',
            'fileLocal': 'assets/audio/deredactiebe/5.mp3',
            'fileRemote': this.root + 'audio\\5.wav'
        }, {
            'name': '6',
            'id': 6,
            'brand': 'deredactie.be',
            'length': '01:23',
            'fileLocal': 'assets/audio/deredactiebe/6.mp3',
            'fileRemote': this.root + 'audio\\6.wav'
        }];

        this.logos = [{
            'name': 'geen',
            'id': 0,
            'brand': 'deredactie.be',
            'fileLocal': 'nvt',
            'fileRemote': 'nvt'
        }, {
            'name': 'Deredactie.be simpel',
            'id': 1,
            'brand': 'deredactie.be',
            'fileLocal': 'assets/logos/deredactie1.png',
            'fileRemote': this.root + 'logos\\deredactie_1.mov'
        }];





        // Place in Firebase where we save the explainers.
        this.moviesRef = new Firebase('vrtnieuwshub.firebaseio.com/apps/explainers');
        // Make it available to the dom as an array
        this.movies = this.$firebaseArray(this.moviesRef);

        // Authenticate the user
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
        const outFolder = this.root + 'out\\' + this.movieId + '\\';
        const tempOutput = this.root + 'out\\' + this.movieId + '\\temp.mp4';
        const fin = this.root + 'finished\\' + this.movieId + '.mp4';
        const finWithLogo = this.root + 'finished\\' + this.movieId + '-logo.mp4';
        const input = this.root + 'in\\' + this.clips[0].movieName;

        let ffmpegLine = '';
        let clipsToOverlay = '';
        let clipsTiming = '';
        let clipOverlaying = '';

        angular.forEach(this.movieClips, (clip) => {
            let clipId = parseInt(clip.id);
            let clipMinusOne = clipId-1;
            let total = parseInt(this.movieClips.length);

            clipsToOverlay = clipsToOverlay + ' -i ' + outFolder + clip.id + '.mov';
            clipsTiming = clipsTiming + '[' + clip.id + ':v]setpts=PTS-STARTPTS+' + clip.start + '/TB[v' + clipId + '];';
            clipOverlaying = clipOverlaying + ';[c' + clipMinusOne + '][v' + clipId + ']overlay=eof_action=pass[c' + clipId + ']';

            if (clipId === total) {
                ffmpegLine = 'ffmpeg -i ' + input + clipsToOverlay + ' -filter_complex \"\"[0:v]setpts=PTS-STARTPTS[v0];' + clipsTiming + '[v0]scale=1920:1080 [c0]' + clipOverlaying + '\"\" -map [c' + clipId +  '] -map 0:1? ' + tempOutput;
                if (this.clips[0].audio !== 0) {
                    ffmpegLine = ffmpegLine + ' && ffmpeg -i ' + tempOutput + ' ' + outFolder + 'audio.mp3 && ffmpeg -i ' + outFolder + 'audio.mp3 -i ' + this.audioTracks[this.clips[0].audio].fileRemote + ' -filter_complex amerge -c:a libmp3lame -q:a 4 ' + outFolder + 'audioMix.mp3 && ffmpeg -i ' + tempOutput + ' -i ' + outFolder + 'audioMix.mp3 -c:v copy -c:a aac -strict experimental -map 0:v:0 -map 1:a:0 ' + fin;
                    if (this.clips[0].logo !== "0") {
                        ffmpegLine = ffmpegLine + ' && ffmpeg -i ' + fin + ' -i ' + this.logos[this.clips[0].logo].fileRemote + ' -filter_complex overlay=10:10 ' + finWithLogo;
                        deferred.resolve(ffmpegLine);
                    } else {
                        deferred.resolve(ffmpegLine);
                    }
                } else {
                    deferred.resolve(ffmpegLine);
                }
            }
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
        this.audioTrack = 0;
        this.selectedLogo = 0;
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
                if (clips[0].audio) {
                    this.audioTrack = clips[0].audio;
                }
                if (clips[0].logo) {
                    this.selectedLogo = clips[0].logo;
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

                clip.id = counter;
                clip['render-status'] = 'ready';
                clip.bot = 'render';
                clip.last = 'false';
                clip.output = this.movieId + '/' + counter;
                clip.module = 'jpg2000';

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
                clip.ffmpeg = ffmpegLine;


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

    // Happens when the dropdown of the audio is changed.
    setAudio(audioId) {
        this.clips[0].audio = audioId;
        this.audioTrackUrl = this.audioTracks[audioId].fileLocal;
        this.clips.$save(0);
    };


    setLogo(logoId) {
        this.clips[0].logo = logoId;
        console.log(logoId, this.logos[logoId].fileLocal);
        this.logoUrl = this.logos[logoId].fileLocal;
        this.clips.$save(0);
    };

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
                // this.clips[0].movieWidth = resp.data.width;
                // this.clips[0].movieHeight = resp.data.height;
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

ExplainersController.$inject = ['$scope', '$sce', '$http', '$document', 'Upload', 'toast', 'firebaseAuth', '$firebaseArray', 'userManagement', 'videogular', '$q'];

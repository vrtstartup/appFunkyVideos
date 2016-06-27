export default class ExplainersController {
    constructor($scope, $sce, $http, $document, Upload, toast, firebaseAuth, $firebaseArray, userManagement, videogular, $q, ffmpegLine) {

        this.$scope = $scope;
        this.$http = $http;
        this.$document = $document;
        this.Upload = Upload;
        this.toast = toast;
        this.$firebaseArray = $firebaseArray;
        this.userManagement = userManagement;
        this.videogular = videogular;
        this.$q = $q;
        this.ffmpegLine = ffmpegLine;
        this.$sce = $sce;
        this.activeTab = 1;
        this.clips = '';
        this.file = {};
        this.movieClips = [];
        this.movieId = '';
        this.movie = {meta:{
            'audio': 0,
            'logo': 0,
            'bumpers': 1,
            'movieUrl': ''
        }};
        this.movieUploadStatus = 'none';
        // this.movieUrl = '';
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
            'fileLocal': null,
            'fileRemote': null
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
            'fileLocal': null,
            'fileRemote': null
        }, {
            'name': 'Deredactie.be simpel',
            'id': 1,
            'brand': 'deredactie.be',
            'fileLocal': 'assets/logos/deredactie1.png',
            'fileRemote': this.root + 'logos\\deredactie_1.mov'
        }];


        this.bumpers = [{
            'name': 'geen',
            'id': 0,
            'brand': 'deredactie.be',
            'fileLocal': null,
            'fileRemote': null
        }, {
            'name': 'Deredactie.be simpel',
            'id': 1,
            'brand': 'deredactie.be',
            'fileLocal': 'assets/bumpers/deredactie1.png',
            'fileRemote': this.root + 'bumpers\\deredactie_1.mov',
            'fade': 2
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
                    this.movie.meta.email = authData.password.email;
                    this.movie.meta.brand = obj.brand;
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




    // createFFMPEGLine() {
    //     const deferred = this.$q.defer();
    //     const outFolder = this.root + 'out\\' + this.movieId + '\\';
    //     const tempOutput = this.root + 'out\\' + this.movieId + '\\temp.mp4';
    //     const fin = this.root + 'finished\\' + this.movieId + '.mp4';
    //     const finWithLogo = this.root + 'finished\\' + this.movieId + '-logo.mp4';
    //     const input = this.root + 'in\\' + this.meta.movieName;

    //     let ffmpegLine = '';
    //     let clipsToOverlay = '';
    //     let clipsTiming = '';
    //     let clipOverlaying = '';

    //     angular.forEach(this.movieClips, (clip) => {
    //         let clipId = parseInt(clip.id);
    //         let clipMinusOne = clipId-1;
    //         let total = parseInt(this.movieClips.length);

    //         clipsToOverlay = clipsToOverlay + ' -i ' + outFolder + clip.id + '.mov';
    //         clipsTiming = clipsTiming + '[' + clip.id + ':v]setpts=PTS-STARTPTS+' + clip.start + '/TB[v' + clipId + '];';
    //         clipOverlaying = clipOverlaying + ';[c' + clispMinusOne + '][v' + clipId + ']overlay=eof_action=pass[c' + clipId + ']';

    //         if (clipId === total) {
    //             ffmpegLine = 'ffmpeg -i ' + input + clipsToOverlay + ' -filter_complex \"\"[0:v]setpts=PTS-STARTPTS[v0];' + clipsTiming + '[v0]scale=1920:1080 [c0]' + clipOverlaying + '\"\" -map [c' + clipId +  '] -map 0:1? ' + tempOutput;
    //             if (this.meta.audio !== 0) {
    //                 ffmpegLine = ffmpegLine + ' && ffmpeg -i ' + tempOutput + ' ' + outFolder + 'audio.mp3 && ffmpeg -i ' + outFolder + 'audio.mp3 -i ' + this.audioTracks[this.meta.audio].fileRemote + ' -filter_complex amerge -c:a libmp3lame -q:a 4 ' + outFolder + 'audioMix.mp3 && ffmpeg -i ' + tempOutput + ' -i ' + outFolder + 'audioMix.mp3 -c:v copy -c:a aac -strict experimental -map 0:v:0 -map 1:a:0 ' + fin;
    //                 if (this.meta.logo !== "0") {
    //                     ffmpegLine = ffmpegLine + ' && ffmpeg -i ' + fin + ' -i ' + this.logos[this.meta.logo].fileRemote + ' -filter_complex overlay=10:10 ' + finWithLogo;
    //                     deferred.resolve(ffmpegLine);
    //                 } else {
    //                     deferred.resolve(ffmpegLine);
    //                 }
    //             } else {
    //                 deferred.resolve(ffmpegLine);
    //             }
    //         }
    //     });
    //     return deferred.promise;
    // }




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

    thisMoment() {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!
        let hours = today.getHours();
        let minutes = today.getMinutes();
        let seconds = today.getSeconds();
        let yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        let date = yyyy + mm + dd + '_' + hours + minutes + seconds;
        console.log(date);
        return date;

    }

    openMovie(movieId) {
        this.audioTrack = 0;
        this.selectedLogo = 0;
        this.bumper = 1;
        this.movieUploadStatus = 'none';
        this.movieId = movieId;
        this.ref = new Firebase('vrtnieuwshub.firebaseio.com/apps/explainers/' + movieId);
        this.refMeta = new Firebase('vrtnieuwshub.firebaseio.com/apps/explainers/' + movieId + '/meta');

        this.clips = this.$firebaseArray(this.ref);
        this.meta = this.$firebaseArray(this.refMeta);

        this.clips.$loaded(

            (resp) => {

                console.log(this.clips);
console.log(this.meta);

                this.activeTab = 1;
                if (this.meta.movieUrl) {
                    this.movieUploadStatus = 'uploaded';
                }
                if (this.meta.audio) {
                    this.audioTrack = this.meta.audio;
                }
                if (this.meta.bumper) {
                    this.bumper = this.meta.bumper;
                }
                if (this.meta.logo) {
                    this.selectedLogo = this.meta.logo;
                }


            },
            (error) => {
                console.error("Error:", error);
            });
    }

    renderMovie() {
        let counter = 1;
        let ffmpegLine = '';
        let project = this.thisMoment() + '_' + (this.meta.email.substring(0, this.meta.email.indexOf("@"))).replace('.', '');
        console.log(project);
        this.movieClips = [];

        angular.forEach(this.clips, (clip) => {
            if (clip.$id !== '0') {

                clip.id = counter;
                clip['render-status'] = 'ready';
                clip.bot = 'render';
                clip.last = 'false';
                clip.output = project + '/clips/' + counter;
                clip.module = 'jpg2000';

                this.movieClips.push(clip);



                if (clip.$id !== '0' && counter == this.clips.length - 1) {

                    this.ffmpegLine.videoOverlays(this.movieClips, this.meta, this.root, project).then((ffmpeg, state) => {

                        this.ffmpegLine.addLogo(ffmpeg, this.logos[this.meta.logo].fileRemote, this.root, project, state).then((ffmpeg) => {

                            this.ffmpegLine.addBumper(ffmpeg, this.bumpers[this.meta.bumper].fileRemote, this.bumpers[this.meta.bumper].fade, this.meta.movieDuration, this.root, project, state).then((ffmpeg) => {

                                this.ffmpegLine.addAudio(ffmpeg, this.audioTracks[this.meta.audio].fileRemote, this.root, project, state).then((ffmpeg) => {
                                    console.log(ffmpeg);


                                });






                            });



                        });


                    });

                    // this.createFFMPEGLine().then((resp) => {
                    //     ffmpegLine = resp;
                    //     this.sendToTemplater(ffmpegLine);
                    // });
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

                clip.email = this.meta.email;
                clip.movie = this.meta.movieName;
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
        this.meta.audio = audioId;
        this.audioTrackUrl = this.audioTracks[audioId].fileLocal;
        this.clips.$save(0);
    };


    setLogo(logoId) {
        this.meta.logo = logoId;
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
        console.log(this.movie);
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
                let movieMeta = {
                    movieName : resp.data.filenameIn,
                    movieUrl : resp.data.image,
                    movieDuration : movieDuration

                }
                // this.meta.movieName = resp.data.filenameIn;
                // this.meta.movieUrl = resp.data.image;
                // this.meta.movieDuration = movieDuration;
                // console.log(this.meta);
                this.meta.$save(movieMeta).then((ref) => {
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

ExplainersController.$inject = ['$scope', '$sce', '$http', '$document', 'Upload', 'toast', 'firebaseAuth', '$firebaseArray', 'userManagement', 'videogular', '$q', 'ffmpegLine'];

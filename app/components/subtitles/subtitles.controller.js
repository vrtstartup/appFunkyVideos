import { keys, extend, find, reject } from 'lodash';

export default class SubtitlesController {
    constructor($log, srt, FileSaver, $sce, $scope, videogular, Upload, $timeout, hotkeys, toast, firebaseAuth, $firebaseObject, $firebaseArray, userManagement, templater, $http, $mdDialog) {
        this.$log = $log;
        this.$sce = $sce;
        this.srt = srt;
        this.$scope = $scope;
        this.FileSaver = FileSaver;
        this.videogular = videogular;
        this.hotkeys = hotkeys;
        this.Upload = Upload;
        this.$timeout = $timeout;
        this.toast = toast;
        this.userManagement = userManagement;
        this.templater = templater;
        this.$http = $http;
        this.$mdDialog = $mdDialog;
        this.movieDuration = 0;
        this.progressPercentage = '';
        this.clipSlider = {};
        this.timeSlider = {};
        this.currentSubtitlePreview = '';
        this.numberOfProjects = 20;
        this.currentTime = '';
        this.playingVideo = '';
        this.loop = false;
        this.$scope.$on('currentTime', (event, data) => {
            this.currentTime = data;
        });
        this.$scope.$on('onUpdateState', (event, data) => {
            if (data === 'play') {
                this.playingVideo = true;
            } else if (data === 'pause') {
                this.playingVideo = false;
            }
        });


        this.selectedSub = {};

        this.firebaseAuth = firebaseAuth;
        this.$firebaseObject = $firebaseObject;
        this.$firebaseArray = $firebaseArray;

        this.movieActive = false;
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
        this.ref = new Firebase('vrtnieuwshub.firebaseio.com/apps/subtitles/');
        this.query = this.ref.limitToLast(this.numberOfProjects);
        this.movies = this.$firebaseArray(this.query);


        // Authenticate the user
        this.firebaseAuth = firebaseAuth;
        this.firebaseAuth.$onAuth((authData) => {
            if (authData) {
                this.userManagement.checkAccountStatus(authData.uid).then((obj, message, error) => {
                    this.movie.meta.email = authData.password.email;
                    this.movie.meta.brand = obj.brand;
                    this.movie.meta.uid = authData.uid;
                });

            }
        });


        // Hotkeys to make editing superfast and smooth. Using angular-hotkeys (http://chieffancypants.github.io/angular-hotkeys/)
        this.hotkeys.add({
            combo: 'i',
            description: 'Begin van ondertitel',
            callback: () => {
                this.selectedSub.start = this.currentTime;
                let c = this.clips.$getRecord(this.selectedSub.id);
                c.start = this.selectedSub.start;
                this.clips.$save(c);
            }
        });

        this.hotkeys.add({
            combo: 'o',
            description: 'Einde van ondertitel',
            callback: () => {
                this.selectedSub.end = this.currentTime;
                let c = this.clips.$getRecord(this.selectedSub.id);
                c.end = this.selectedSub.end;
                this.clips.$save(c);
            }
        });

        this.hotkeys.add({
            combo: 'k',
            description: 'Frame verder',
            callback: () => {
                this.videogular.api.pause();
                this.goToTime(this.currentTime + 0.01);
            }
        });

        this.hotkeys.add({
            combo: 'j',
            description: 'Frame terug',
            callback: () => {
                this.videogular.api.pause();
                this.goToTime(this.currentTime - 0.01);
            }
        });


        this.hotkeys.add({
            combo: 'l',
            description: 'Loop aan / uit',
            callback: () => {
                this.toggleLoop();
            }
        });

        this.hotkeys.add({
            combo: 'u',
            description: 'Nieuwe ondertitel',
            callback: () => {
                this.addSubtitle(this.meta.movieDuration);
            }
        });

    }

    // Start a new movie
    createMovie() {
        this.movie.meta.projectId = this.templater.time() + '_' + (this.movie.meta.email.substring(0, this.movie.meta.email.indexOf("@"))).replace('.', '');
        this.movies.$add(this.movie).then((ref) => {

            this.openMovie(ref.key());
            // this.addSubtitle(0.001, 9999, 9999);
            this.$mdDialog.cancel();
        });
    }

    finishMovie(ev) {
        this.$mdDialog.show({
            templateUrl: '/components/subtitles/finish.dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            escapeToClose: false,
            scope: this.$scope,
            preserveScope: true
        });
    }

     openProjects(ev) {
        this.$mdDialog.show({
            templateUrl: '/components/subtitles/projects.dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            escapeToClose: false,
            scope: this.$scope,
            preserveScope: true
        });
    }


    // Opening movie, after create, of when you click in the list with projects
    openMovie(movieId) {
        this.meta = {};

        this.bumper = this.movie.bumper; // Should go away once bumper is add as an option
        this.uploading = false;

        this.projectRef = this.ref.child(movieId);
        this.clipsRef = this.projectRef.child('subs').orderByChild('start');
        this.clips = this.$firebaseArray(this.clipsRef);

        this.refMeta = this.projectRef.child('meta');
        this.meta = this.$firebaseObject(this.refMeta);

        this.clips.$loaded(
            (resp) => {
                this.movieActive = true;
                if (this.meta.movieDuration) {
                    this.clip = { end: this.meta.movieDuration, start: 0.001 };
                    this.setClipSlider(this.meta.movieDuration);
                    this.setTimeSlider(this.meta.movieDuration);
                }
                this.$mdDialog.cancel();
            },
            (error) => {
                console.error("Error:", error);
            });
    }

    toggleLoop() {
        this.loop = !this.loop;
        this.goToTime(this.selectedSub.start);

    }

    closeModal() {
        this.$mdDialog.cancel();
    }

    // Add one clip
    addSubtitle(movieDuration) {

        // get last clip
        let lastClip = {};
        this.projectRef.child('subs').orderByChild('start').limitToLast(1).once("value", function(snapshot) {
            snapshot.forEach(function(data) {
                lastClip = data.val();
            });
        });

        var clip = {};

        if (movieDuration) {
            if (this.clips.length > 1) {
                clip = { end: movieDuration, start: lastClip.end };
            } else {
                clip = { end: movieDuration, start: 0.001 };
            }

            this.selectedSub = {
                start: clip.start,
                end: clip.end,
                id: 1,
            };
            this.clips.$add(clip).then((ref) => {
                this.selectSub(ref.key(), ref.start, ref.end);
                this.goToTime(ref.start);
            });
        }
    }

    // Make the video follow when the range gets dragged
    goToTime(time) {
        this.videogular.api.seekTime(time);

    }




    selectSub(id, start, end) {
        this.loop = true;
        this.selectedSub = {
            'id': id,
            'start': start,
            'end': end
        };
        this.goToTime(start);

    }

    renderSubtitles(clips) {

        this.templater.createAss(clips).then((ass) => {
            let assFile = new Blob([ass], {
                type: 'ass'
            });
            let assFileName = this.meta.projectId + '.ass';
            this.uploadSRT(assFile, assFileName, this.meta.email);
        });


    }


    secToTime(millis) {
        var dur = {};
        var units = [
            { label: 'millis', mod: 1000 },
            { label: 'seconds', mod: 60 },
            { label: 'minutes', mod: 60 },
        ];
        // calculate the individual unit values...
        units.forEach(function(u) {
            millis = (millis - (dur[u.label] = (millis % u.mod))) / u.mod;
        });



        let twoDigits = function(number) {
            if (number < 10) {
                number = '0' + number;
                return number;
            } else {
                return number;
            }
        };


        let round = function(number) {

            if (number < 99) {
                return number;

            } else {
                number = Math.round((number / 10));
                return number;
            }
        };


        let time = twoDigits(dur.minutes) + ':' + twoDigits(dur.seconds) + '.' + round(dur.millis);
        return time;
    }

    playPausePlayer() {
        console.log(this.videogular.api);
        this.videogular.api.playPause();
    }

    setTimeSlider(movieDuration) {
        this.timeSlider = {
            min: 0,
            max: movieDuration,
            options: {
                showSelectionBar: true,
                translate: (value) => {
                    return this.secToTime(value);
                },
                onStart: () => {
                    this.videogular.api.pause();
                },
                onChange: (id, newValue) => {
                    if (newValue) {

                        // Jump to this point in time in the video

                        this.goToTime(newValue, 'start');

                    }
                },
                onEnd: () => {
                    this.videogular.api.play();
                },
                hideLimitLabels: true,

                floor: 0,
                ceil: movieDuration,
                precision: 3,
                step: 0.001,
                draggableRange: true,
                keyboardSupport: true
            }
        };

    }


    setClipSlider(movieDuration) {
        let c;
        this.clipSlider = {
            min: 0.001,
            max: movieDuration,
            options: {
                translate: (value) => {
                    return this.secToTime(value);
                },
                onStart: () => {
                    this.videogular.api.pause();
                },

                onEnd: () => {
                    this.videogular.api.play();
                },
                noSwitching: true,
                onChange: (id, newValue, highValue) => {

                    if (newValue && newValue) {
                        // Jump to this point in time in the video
                        this.goToTime(newValue, 'start');
                        // Set the IN-point of the videoloop
                        this.selectedSub.start = newValue;
                        c = this.clips.$getRecord(this.selectedSub.id);
                        this.clips.$save(c);

                    }
                    if (highValue) {
                        // Jump to this point in time in the video
                        this.goToTime(highValue, 'end');
                        // Set the OUT-point of the videoloop
                        this.selectedSub.end = highValue;
                        c = this.clips.$getRecord(this.selectedSub.id);
                        this.clips.$save(c);
                    }
                },
                floor: 0.001,
                ceil: movieDuration,
                precision: 3,
                step: 0.001,
                draggableRange: true,
                keyboardSupport: true
            }
        };

    }

    // Upload the video
    upload(file) {
        let movieDuration = 0;
        this.uploading = true;

        //get duration of video
        this.Upload.mediaDuration(file).then((durationInSeconds) => {
            movieDuration = Math.round(durationInSeconds * 1000) / 1000;
        });

        // upload to dropbox
        this.Upload.upload({
                url: 'api/movie/upload-to-dropbox',
                data: { file: file },
                method: 'POST'
            })
            .then((resp) => {
                // Set the meta information
                this.meta.movieName = resp.data.filenameIn;
                this.meta.movieUrl = resp.data.image;
                this.meta.movieDuration = movieDuration;
                this.uploading = false;
                this.meta.$save().then((ref) => {
                    // Set slider options
                    this.setClipSlider(movieDuration);
                    this.setTimeSlider(movieDuration);
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


    // Upload the srt
    uploadSRT(file, name, email) {
        this.Upload.upload({
                url: 'api/movie/generateSub',
                data: { file: file, fileName: name, email: email },
                method: 'POST',
            })
            .then((resp) => {
                if (!resp) return;
                this.sendToFFMPEG(resp.data.url, this.meta.movieUrl, this.meta.email, this.meta.logo, this.meta.audio, this.meta.bumper, this.meta.movieDuration);

            }, (resp) => {
                console.log('Error: ' + resp.error);
                console.log('Error status: ' + resp.status);
            }, (evt) => {
                this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
    }







    // upload(file, name, email) {



    //     console.log('upload', name);
    //     if (file.type === "video/mp4" || file.type === "video/quicktime") {
    //         //set duration of video, init slider values
    //         this.Upload.mediaDuration(file).then((durationInSeconds) => {
    //             this.movieDuration = Math.round(durationInSeconds * 1000) / 1000;
    //             this.meta.movieStart = 0.001;
    //             this.meta.formEnd = this.meta.;

    //             this.slider = {
    //                 min: 0.001,
    //                 max: this.movieDuration,
    //                 options: {
    //                     id: 'main',
    //                     floor: 0.001,
    //                     ceil: this.movieDuration,
    //                     precision: 3,
    //                     step: 0.001,
    //                     draggableRange: true,
    //                     keyboardSupport: true
    //                 }
    //             };
    //         });
    //     }

    //     let subtitled = false;
    //     if (!subtitled) {
    //         this.Upload.upload({
    //                 url: 'api/subtitleVideos',
    //                 data: { file: file, fileName: name, email: email },
    //                 method: 'POST',
    //             })
    //             .then((resp) => {
    //                 if (!resp) return;

    //                 subtitled = resp.data.subtitled;

    //                 this.movieUploaded = true;
    //                 this.file.tempUrl = resp.data.url;
    //                 this.file.fileName = resp.data.name;
    //             }, (resp) => {
    //                 console.log('Error: ' + resp.error);
    //                 console.log('Error status: ' + resp.status);
    //             }, (evt) => {
    //                 this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    //             });
    //     }
    // }





    sendToFFMPEG(ass, movie, email, logo, audio, bumper, duration) {

        let fade = 0;

        if (logo === true) {
            logo = this.templater.logos[1].fileLocal;
        }

        if (audio !== 0) {
            audio = this.templater.audioTracks[audio].fileLocal;
        }

        if (bumper === true) {
            fade = this.templater.bumpers[1].fade;
            bumper = this.templater.bumpers[1].fileLocal;
        }

        this.$http({
            data: { ass: ass, movie: movie, email: email, logo: logo, audio: audio, bumper: bumper, duration: duration, fade: fade },
            method: 'POST',
            url: '/api/movie/burnSubs/'
        }).then((res) => {
            console.log(res);
            // this.url = res.data.video_url;
            // return this.url;
        }, (err) => {
            console.error('Error', err);
        });

    }

}

SubtitlesController.$inject = ['$log', 'srt', 'FileSaver', '$sce', '$scope', 'videogular', 'Upload', '$timeout', 'hotkeys', 'toast', 'firebaseAuth', '$firebaseObject', '$firebaseArray', 'userManagement', 'templater', '$http', '$mdDialog'];

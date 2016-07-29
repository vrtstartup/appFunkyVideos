import { keys, extend, find, reject } from 'lodash';

export default class SubtitlesController {
    constructor($log, srt, FileSaver, $sce, $scope, videogular, Upload, $timeout, hotkeys, toast, $firebaseAuth, $firebaseObject, $firebaseArray, userManagement, templater, $http, $mdDialog) {
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
        this.$firebaseObject = $firebaseObject;
        this.$firebaseArray = $firebaseArray;

        this.projectFilters = { email: true };
        this.movieDuration = 0;
        this.numberOfProjects = 200;

        this.clipSlider = {};
        this.timeSlider = {};
        this.selectedSub = {};

        this.currentSubtitlePreview = '';
        this.progressPercentage = '';
        this.playingVideo = '';
        this.clips = '';

        this.movieSend = false;
        this.loop = false;
        this.projectsLoaded = false;
        this.projectActive = false;
        this.uploading = false;

        this.project = {
            meta: {
                'audio': 0,
                'logo': true,
                'bumper': true,
            }
        };

        // Emit coming from video directive
        this.$scope.$on('onUpdateState', (event, data) => {
            if (data === 'play') {
                this.playingVideo = true;
            } else if (data === 'pause') {
                this.playingVideo = false;
            }
        });

        this.user = {};


        // Authenticate the user
        this.firebaseAuth = $firebaseAuth();
        this.firebaseAuth.$onAuthStateChanged((authData) => {
            if (authData) {
                this.userManagement.checkAccountStatus(authData.uid).then((obj, message, error) => {
                    this.user = authData;
                    this.user.brand = obj.brand;
                    this.project.meta.email = authData.email;
                    this.project.meta.sendTo = authData.email;
                    this.project.meta.brand = obj.brand;
                    this.project.meta.uid = authData.uid;
                    this.initFirebase('apps/subtitles/', this.user.brand, this.numberOfProjects);
                });
            }
        });

        // Hotkeys to make editing superfast and smooth. Using angular-hotkeys (http://chieffancypants.github.io/angular-hotkeys/)
        this.hotkeys.add({
            combo: 'i',
            description: 'Begin van ondertitel',
            callback: () => {
                this.selectedSub.start = this.videogular.api.currentTime / 1000;
                let c = this.clips.$getRecord(this.selectedSub.id);
                c.start = this.selectedSub.start;
                this.clips.$save(c);
            }
        });

        this.hotkeys.add({
            combo: 'o',
            description: 'Einde van ondertitel',
            callback: () => {
                this.selectedSub.end = this.videogular.api.currentTime / 1000;
                this.goToTime(this.selectedSub.start);
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
                this.goToTime(this.videogular.api.currentTime / 1000 + 0.01);
            }
        });

        this.hotkeys.add({
            combo: 'j',
            description: 'Frame terug',
            callback: () => {
                this.videogular.api.pause();
                this.goToTime(this.videogular.api.currentTime / 1000 - 0.01);
            }
        });

        this.hotkeys.add({
            combo: 'l',
            description: 'Preview filmpje',
            callback: () => {
                this.preview();
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

    // Initiate Firebase
    initFirebase(app, brand, number) {

        this.ref = firebase.database().ref().child(app);
        this.logsRef = firebase.database().ref('logs');
        this.query = this.ref.orderByChild('meta/brand').equalTo(brand).limitToLast(number);
        this.projects = this.$firebaseArray(this.query);
        this.logs = this.$firebaseArray(this.logsRef);
        this.projects.$loaded()
            .then((x) => {
                this.projectsLoaded = true;
            })
            .catch((error) => {
                console.log("Error:", error);
            });
    }


    showOnlyYours(email, yours) {
        if (yours)
            return (email = email);
        else
            return (email = '');
    }

    // Start a new movie
    createMovie() {
        let userEmail = this.project.meta.email;
        this.project.meta.projectId = this.templater.time() + '_' + (userEmail.substring(0, userEmail.indexOf("@"))).replace('.', '');
        this.projects.$add(this.project).then((ref) => {
            this.openProject(ref.key);
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
    openProject(projectId) {
        this.meta = {};
        this.bumper = this.project.bumper; // Should go away once bumper is add as an option
        this.uploading = false;
        this.projectRef = this.ref.child(projectId);
        this.clipsRef = this.projectRef.child('subs').orderByChild('start');
        this.clips = this.$firebaseArray(this.clipsRef);
        this.refMeta = this.projectRef.child('meta');
        this.meta = this.$firebaseObject(this.refMeta);
        this.refLogs = this.projectRef.child('logs');
        this.logs = this.$firebaseObject(this.refLogs);

        this.projectId = projectId;
        this.clips.$loaded(
            (resp) => {
                this.projectActive = true;
                if (this.meta.movieDuration) {
                    this.clip = { end: this.meta.movieDuration, start: 0.001 };
                    this.setClipSlider(this.meta.movieDuration);
                }
                this.$mdDialog.cancel();
            },
            (error) => {
                console.error("Error:", error);
            });
    }

    preview() {
        this.loop = false;
        this.selectedSub.id = null;
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

            if (this.clips.length >= 1 ) {

                clip = { end: movieDuration, start: (lastClip.end * 1 + 0.010) };
            } else {
                clip = { end: movieDuration, start: 0.001 };
            }

            this.clips.$add(clip).then((ref) => {
                console.log(ref);
                this.selectSub(ref.key, clip.start, clip.end);
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
        console.log('select sub', this.selectedSub);
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

    setClipSlider(movieDuration) {
        let c;
        this.clipSlider = {
            min: 0.001,
            max: movieDuration,
            options: {
                // translate: (value) => {
                //     return this.secToTime(value);
                // },
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
                        // this.goToTime(newValue, 'start');
                        // Set the IN-point of the videoloop
                        this.selectedSub.start = newValue;
                        c = this.clips.$getRecord(this.selectedSub.id);
                        this.clips.$save(c);

                    }
                    if (highValue) {
                        // Jump to this point in time in the video
                        // this.goToTime(highValue, 'end');
                        // Set the OUT-point of the videoloop
                        this.selectedSub.end = highValue;
                        c = this.clips.$getRecord(this.selectedSub.id);
                        this.clips.$save(c);
                    }
                },
                hideLimitLabels: true,
                floor: 0.001,
                ceil: movieDuration,
                precision: 3,
                step: 0.001,
                draggableRange: true,
                keyboardSupport: true
            }
        };

        this.clipsSlider = {
            min: 0.001,
            max: movieDuration,
            options: {
                noSwitching: true,
                disabled: true,

                hideLimitLabels: true,
                floor: 0.001,
                ceil: movieDuration,
                precision: 3,
                step: 0.001,
                // draggableRange: true,
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

        console.log(this.meta.log);
        // upload to dropbox
        this.Upload.upload({
                url: 'api/movie/upload-to-dropbox',
                data: { file: file },
                params: {
                    logs: this.meta.log
                },
                method: 'POST'
            })
            .then((resp) => {
                // Set the meta information
                this.meta.movieName = resp.data.filenameIn;
                this.meta.movieWidth = resp.data.width;
                this.meta.movieHeight = resp.data.height;
                this.meta.movieUrl = resp.data.image;
                this.meta.movieDuration = movieDuration;
                this.uploading = false;
                this.meta.$save().then((ref) => {
                    // Set slider options
                    this.setClipSlider(movieDuration);
                    // this.setTimeSlider(movieDuration);
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
                console.log('generated subs');
                if (!resp) return;
                console.log('sending to ffmpeg');
                console.log(this.project);
                this.sendToFFMPEG(resp.data.url, this.meta.movieUrl, this.meta.sendTo, this.meta.logo, this.meta.audio, this.meta.bumper, this.meta.movieDuration, this.meta.movieWidth, this.meta.movieHeight, this.projectId);
            }, (resp) => {
                console.log('Error: ' + resp.error);
                console.log('Error status: ' + resp.status);
            }, (evt) => {
                this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
    }
    setAudio(audioId) {
        this.meta.audio = audioId;
        this.audioTrackUrl = this.templater.audioTracks[audioId].fileLocal;
        this.meta.$save().then(function(ref) {}, function(error) {
            console.log("Error:", error);
        });
    }

    sendToFFMPEG(ass, movie, email, logo, audio, bumper, duration, width, height, projectId) {
        let fade = 0;
        let bumperLength = '';
        if (logo === true) {
            logo = this.templater.logos[1].fileLocal;
        }
        if (audio !== false) {
            audio = this.templater.audioTracks[audio].fileLocal;
        } else {
            audio = false;
        }
        console.log(audio);
        if (bumper === true) {
            fade = this.templater.bumpers[1].fade;
            bumperLength = this.templater.bumpers[1].bumperLength;
            bumper = this.templater.bumpers[1].fileLocal;
        }
        this.movieSend = true;
        console.log('sending to ffmpeg');
        this.$http({
            data: { ass: ass, movie: movie, email: email, logo: logo, audio: audio, bumper: bumper, duration: duration, fade: fade, width: width, height: height, bumperLength: bumperLength, project: projectId },
            method: 'POST',
            url: '/api/movie/burnSubs/'
        }).then((res) => {
            console.log(res);
        }, (err) => {
            console.error('Error', err);
        });
    }
}

SubtitlesController.$inject = ['$log', 'srt', 'FileSaver', '$sce', '$scope', 'videogular', 'Upload', '$timeout', 'hotkeys', 'toast', '$firebaseAuth', '$firebaseObject', '$firebaseArray', 'userManagement', 'templater', '$http', '$mdDialog'];

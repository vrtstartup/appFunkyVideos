import { keys, extend, find, reject } from 'lodash';

export default class SubtitlesController {
    constructor($log, srt, FileSaver, $sce, $scope, videogular, Upload, $timeout, toast, $firebaseAuth, $firebaseObject, $firebaseArray, userManagement, templater, $http, $mdDialog, hotkeys) {
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

        // Interface Vars
        this.projectFilters = { email: true };
        this.numberOfProjects = 200;
        this.playingVideo = '';
        this.loop = false;
        this.projectsLoaded = false;
        this.movieSend = false;
        this.projectActive = false;
        this.uploading = false;
        this.selectedTemplate = '';

        // User Vars
        this.user = {};

        // Project Vars
        this.movieDuration = 0;
        this.selectedSub = {};
        this.progressPercentage = '';
        this.project = {
            meta: {
                'audio': 0,
                'logo': 0,
                'bumper': 0,
            }
        };

        // Subtitle Vars
        this.subs = '';
        this.subSlider = {};

        // Visual Vars
        this.visuals = '';
        this.visualSlider = {};
        this.clipTemplates = this.templater.clipTemplates;
        this.bumpers = this.templater.bumpers;
        this.logos = this.templater.logos;

        // Authenticate the user
        this.firebaseAuth = $firebaseAuth();
        this.firebaseAuth.$onAuthStateChanged((authData) => {
            if (authData) {
                this.userManagement.checkAccountStatus(authData.uid).then((obj, message, error) => {
                    this.user = authData;
                    this.user.brand = obj.brand;
                    this.user.role = obj.role;
                    this.project.meta.email = authData.email;
                    this.project.meta.sendTo = authData.email;
                    this.project.meta.brand = obj.brand;
                    this.project.meta.uid = authData.uid;
                    this.initFirebase('apps/subtitles/', this.user.brand, this.numberOfProjects);
                });
            }
        });

        // Ad hotkeys
        let c = '';

        this.hotkeys.add({
            combo: 'i',
            description: 'Begin van ondertitel',
            callback: () => {
                if (this.selectedSub.type === 'visual') {
                    this.toast.showToast('error', 'Bij visuele elementen kan je de sneltoesten niet gebruiken.');
                } else {
                    this.selectedSub.start = this.videogular.api.currentTime / 1000;
                    c = this.subs.$getRecord(this.selectedSub.id);
                    c.start = this.selectedSub.start;
                    this.subs.$save(c);
                }
            }
        });

        this.hotkeys.add({
            combo: 'o',
            description: 'Einde van ondertitel',
            callback: () => {
                if (this.selectedSub.type === 'visual') {
                    this.toast.showToast('error', 'Bij visuele elementen kan je de sneltoesten niet gebruiken.');
                } else {
                    this.selectedSub.end = this.videogular.api.currentTime / 1000;
                    this.goToTime(this.selectedSub.start);
                    c = this.subs.$getRecord(this.selectedSub.id);
                    c.end = this.selectedSub.end;
                    this.subs.$save(c);
                }

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
            description: 'Voeg toe',
            callback: () => {
                this.addSubtitle(this.meta.movieDuration);
            }
        });

        this.hotkeys.add({
            combo: 'space',
            description: 'start|stop video',
            callback: () => {
                this.videogular.api.playPause();
            }
        });
    }

    // Initiate Firebase
    initFirebase(app, brand, number) {
        this.ref = firebase.database().ref().child(app);
        this.query = this.ref.orderByChild('meta/brand').equalTo(brand).limitToLast(number);
        this.projects = this.$firebaseArray(this.query);
        this.projects.$loaded()
            .then((x) => {
                this.projectsLoaded = true;
            })
            .catch((error) => {
            });
    }

    /*
        ____      __            ____                   ____                 __  _
       /  _/___  / /____  _____/ __/___ _________     / __/_  ______  _____/ /_(_)___  ____  _____
       / // __ \/ __/ _ \/ ___/ /_/ __ `/ ___/ _ \   / /_/ / / / __ \/ ___/ __/ / __ \/ __ \/ ___/
     _/ // / / / /_/  __/ /  / __/ /_/ / /__/  __/  / __/ /_/ / / / / /__/ /_/ / /_/ / / / (__  )
    /___/_/ /_/\__/\___/_/  /_/  \__,_/\___/\___/  /_/  \__,_/_/ /_/\___/\__/_/\____/_/ /_/____/

    */

    showOnlyYours(email, yours) {
        if (yours)

            return (email = email);
        else
            return (email = '');
    }

    preview() {
        this.loop = false;
        this.selectedSub.id = null;
        this.subs.selected = false;
    }

    closeModal() {
        this.$mdDialog.cancel();
    }

    // Show the dialog to finish the movie
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

    // Show the dialog to open a project
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

    /*

        ____               _           __     ______            __  _
       / __ \_________    (_)__  _____/ /_   / ____/_  ______  / /_(_)___  ____  _____
      / /_/ / ___/ __ \  / / _ \/ ___/ __/  / /_  / / / / __ \/ __/ / __ \/ __ \/ ___/
     / ____/ /  / /_/ / / /  __/ /__/ /_   / __/ / /_/ / / / / /_/ / /_/ / / / (__  )
    /_/   /_/   \____/_/ /\___/\___/\__/  /_/    \__,_/_/ /_/\__/_/\____/_/ /_/____/
                    /___/

    */

    // Start a new movie
    createMovie() {
        let userEmail = this.project.meta.email;
        this.project.meta.projectId = this.templater.time() + '_' + (userEmail.substring(0, userEmail.indexOf("@"))).replace('.', '');
        this.projects.$add(this.project).then((ref) => {
            this.openProject(ref.key);
            this.$mdDialog.cancel();
        });

    }

    // Opening movie, after create, of when you click in the list with projects
    openProject(projectId) {
        this.meta = {};
        this.bumper = this.project.bumper; // Should go away once bumper is add as an option
        this.uploading = false;
        this.projectRef = this.ref.child(projectId);
        this.subsRef = this.projectRef.child('subs').orderByChild('start');
        this.subs = this.$firebaseArray(this.subsRef);
        this.refMeta = this.projectRef.child('meta');
        this.meta = this.$firebaseObject(this.refMeta);
        this.refLogs = this.projectRef.child('logs');
        this.logs = this.$firebaseObject(this.refLogs);

        this.projectId = projectId;
        this.subs.$loaded(
            (resp) => {
                this.projectActive = true;
                if (this.meta.movieDuration) {
                    this.clip = { end: this.meta.movieDuration, start: 0.001 };
                    this.setSubSlider(this.meta.movieDuration);
                }
                this.$mdDialog.cancel();
            },
            (error) => {
                console.error("Error:", error);
            });
    }

    removeProject(projectId, owner) {
        if (this.user.email === owner) {
            var project = this.projects.$getRecord(projectId);
            this.projects.$remove(project).then((ref) => { });
        } else {
            this.toast.showToast('error', 'Dit is niet jouw filmpje, dus kan je het ook niet verwijderen.');
        }
    }

    // get the html form that belongs with this template
    getTemplate(type, key) {
        let template = this.clipTemplates[key];
        this.selectedTemplate = template.meta.form;
    }

    // Add one subtitle
    addSubtitle(movieDuration, $event) {
        // remove focus from button
        $event.currentTarget.blur();
        
        // get last subtitle
        let lastClip = {};
        this.projectRef.child('subs').orderByChild('start').limitToLast(1).once("value", function (snapshot) {
            snapshot.forEach(function (data) {
                lastClip = data.val();
            });
        });

        let clip = {};

        // this should be writing more variable, it breaks when order changes of templates, or if we put the templates in firebase or whatever
        let templateId = 0;
        if (this.user.brand === 'stubru') {
            templateId = 4;
        }

        if (movieDuration) {
            if (this.subs.length > 0) {
                clip = { end: movieDuration, start: (lastClip.end * 1 + 0.010), template: templateId, type: 'sub' };
            } else {
                clip = { end: movieDuration, start: 0.001, template: 0, type: 'sub' };
            }

            this.subs.$add(clip).then((ref) => {
                this.selectClip(ref.key, clip.start, clip.end, clip.type, templateId, 'form');
            });
        }

    }

    // Make the video follow when the range gets dragged
    goToTime(time) {
        this.videogular.api.seekTime(time);
    }

    selectClip(id, start, end, type, template, context) {
        
        // toggles templates visibility
        this.subs.selected = true;

        if (type === 'visual') {
            this.subSlider.options.draggableRangeOnly = true;
        } else {
            this.subSlider.options.draggableRangeOnly = false;
        }
        this.getTemplate(context, template);

        this.loop = true;
        this.selectedSub = {
            'id': id,
            'start': start,
            'end': end,
            'template': template,
            'type': type
        };
        this.goToTime(start);
    }

    secToTime(millis) {
        let dur = {};
        let units = [
            { label: 'millis', mod: 1000 },
            { label: 'seconds', mod: 60 },
            { label: 'minutes', mod: 60 },
        ];
        // calculate the individual unit values...
        units.forEach(function (u) {
            millis = (millis - (dur[u.label] = (millis % u.mod))) / u.mod;
        });

        let twoDigits = function (number) {
            if (number < 10) {
                number = '0' + number;
                return number;
            } else {
                return number;
            }
        };
        let round = function (number) {
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

    // setAudio(audioId) {
    //     this.meta.audio = audioId;
    //     this.audioTrackUrl = this.templater.audioTracks[audioId].fileLocal;
    //     this.meta.$save().then(function(ref) {}, function(error) {
    //         console.log("Error:", error);
    //     });
    // }
    

    setTemplate(type, key) {

        this.selectedSub.type = type;

        let c = this.subs.$getRecord(this.selectedSub.id);
        c.template = key;
        c.type = type;

        this.subSlider.options.draggableRangeOnly = false;
        if (type === 'visual') {
            this.subSlider.options.draggableRangeOnly = true;
            c.end = c.start + this.clipTemplates[key].meta.length;
        }
        this.subs.$save(c);
        this.selectedSub.template = key;
        this.getTemplate('form', key);
    }

    setSubSlider(movieDuration) {
        let c;
        this.subSlider = {
            min: 0.001,
            max: movieDuration,
            options: {
                onStart: () => {
                    this.videogular.api.pause();
                },

                onEnd: () => {
                    this.videogular.api.play();
                },
                noSwitching: true,
                onChange: (id, newValue, highValue) => {
                    if (newValue) {
                        this.selectedSub.start = newValue;
                        c = this.subs.$getRecord(this.selectedSub.id);
                        this.subs.$save(c);
                    }
                    if (highValue) {
                        this.selectedSub.end = highValue;
                        c = this.subs.$getRecord(this.selectedSub.id);
                        this.subs.$save(c);
                    }
                },
                hideLimitLabels: true,
                floor: 0.001,
                ceil: movieDuration,
                precision: 3,
                step: 0.001,
                draggableRangeOnly: false,
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
                this.meta.dropboxPath = resp.data.dbPath;
                this.meta.movieName = resp.data.filenameIn;
                this.meta.movieWidth = resp.data.width;
                this.meta.movieHeight = resp.data.height;
                this.meta.movieUrl = resp.data.image;
                this.meta.movieDuration = movieDuration;
                this.uploading = false;
                this.meta.$save().then((ref) => {
                    // Set slider options
                    this.setSubSlider(movieDuration);
                    // this.setTimeSlider(movieDuration);
                }, (error) => {
                });
            }, (resp) => {
                console.dir(resp);
            }, (evt) => {
                this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
    }

    /*
       _____ _______   ______     ________  ________   __  _______ _    ____________
      / ___// ____/ | / / __ \   /_  __/ / / / ____/  /  |/  / __ \ |  / /  _/ ____/
      \__ \/ __/ /  |/ / / / /    / / / /_/ / __/    / /|_/ / / / / | / // // __/
     ___/ / /___/ /|  / /_/ /    / / / __  / /___   / /  / / /_/ /| |/ // // /___
    /____/_____/_/ |_/_____/    /_/ /_/ /_/_____/  /_/  /_/\____/ |___/___/_____/


    */

    renderMovie(clips) {
        // Filter subs from visuals
        let subs = [];
        let visuals = [];
        angular.forEach(clips, (value, key) => {
            if (value.type === 'sub') {
                subs.push(value);
            } else if (value.type === 'visual') {

                visuals.push(value);
            }
        });
        this.templater.renderMovie(subs, visuals, this.meta, this.projectId).then((resp) => {
            this.movieSend = true;
        });
    }

}



SubtitlesController.$inject = ['$log', 'srt', 'FileSaver', '$sce', '$scope', 'videogular', 'Upload', '$timeout', 'toast', '$firebaseAuth', '$firebaseObject', '$firebaseArray', 'userManagement', 'templater', '$http', '$mdDialog', 'hotkeys'];

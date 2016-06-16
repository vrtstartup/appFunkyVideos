import { keys, extend, find, reject } from 'lodash';

export default class SubtitlesController {
    constructor($log, srt, FileSaver, $sce, $scope, videogular, Upload, $timeout, hotkeys, toast, firebaseAuth, $firebaseObject, $firebaseArray, userManagement, templater) {
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

        this.movieDuration = 0;
        this.progressPercentage = '';
        this.slider = {};
        this.currentTime = '';
        this.currentSubtitlePreview = '';

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
        this.movies = this.$firebaseArray(this.ref);


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
            description: 'Get In Time',
            callback: () => {
                this.setIn();
            }
        });

        this.hotkeys.add({
            combo: 'o',
            description: 'Get Out Time',
            callback: () => {
                this.setOut();
            }
        });


        this.hotkeys.add({
            combo: 'p',
            description: 'Start new line',
            callback: () => {
                this.addSubtitle();
            }
        });

        this.hotkeys.add({
            combo: 'k',
            description: 'Start new line',
            callback: () => {
                this.videogular.api.seekTime(this.selectedSub.start - 1 / 1000);
            }
        });

    }

    // Start a new movie
    createMovie() {
        this.movies.$add(this.movie).then((ref) => {
            this.openMovie(ref.key());
            this.addSubtitle(0.001, 9999, 9999);
        });
    }

    // Opening movie, after create, of when you click in the list with projects
    openMovie(movieId) {
        this.meta = {};
        this.bumper = this.movie.bumper; // Should go away once bumper is add as an option
        this.uploading = false;

        let clipsRef = this.ref.child(movieId);
        this.clips = this.$firebaseArray(clipsRef);

        this.refMeta = clipsRef.child('meta');
        this.meta = this.$firebaseObject(this.refMeta);

        this.clips.$loaded(
            (resp) => {
                this.movieActive = true;
                if (this.meta.movieDuration) {
                    this.setSlider(this.meta.movieDuration);
                }
            },
            (error) => {
                console.error("Error:", error);
            });
    }


    // Add one clip
    addSubtitle(start, end, movieDuration) {

        this.selectedSub = {
            start: end,
            end: movieDuration,
            id: 1,
        };

        var clip = {
            'start': end,
            'end': movieDuration
        };
        this.clips.$add(clip).then((ref) => {

        });
    }

    // Make the video follow when the range gets dragged
    goToTime(time, type) {
        this.videogular.api.seekTime(time);
    }


    selectSub(id, start, end) {
        this.selectedSub = {
            'id': id,
            'start': start,
            'end': end
        };
    }

    renderSubtitles(clips) {

        this.templater.createAss(clips).then((ass) => {
            let assFile = new Blob([ass], {
                type: 'ass'
            });
            let assFileName = this.templater.time() + '_' + this.meta.email + '.ass';
            this.upload(assFile, assFileName, this.meta.email);
        });


    }


    setSlider(movieDuration) {
        console.log(movieDuration);
        this.slider = {
            min: 0.001,
            max: movieDuration,
            options: {
                onChange: (id, newValue, highValue) => {
                    if (newValue) {
                        // Jump to this point in time in the video
                        this.goToTime(newValue, 'start');
                        // Set the IN-point of the videoloop
                        this.selectedSub.start = newValue;
                    }
                    if (highValue) {
                        // Jump to this point in time in the video
                        this.goToTime(highValue, 'end');
                        // Set the OUT-point of the videoloop
                        this.selectedSub.end = highValue;
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
            console.log(movieDuration);
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
                this.meta.$save().then((ref) => {
                    // Set slider options
                    this.setSlider(movieDuration);
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



    upload(file, name, email) {

        this.Upload.upload({
                url: 'api/subtitleVideos',
                data: { file: file, fileName: name, email: email },
                method: 'POST',
            })
            .then((resp) => {
                console.log(resp);
                // if (!resp) return;

                // subtitled = resp.data.subtitled;

                // this.movieUploaded = true;
                // this.file.tempUrl = resp.data.url;
                // this.file.fileName = resp.data.name;
            }, (resp) => {
                console.log('Error: ' + resp.error);
                console.log('Error status: ' + resp.status);
            }, (evt) => {
                this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });

    }
}

SubtitlesController.$inject = ['$log', 'srt', 'FileSaver', '$sce', '$scope', 'videogular', 'Upload', '$timeout', 'hotkeys', 'toast', 'firebaseAuth', '$firebaseObject', '$firebaseArray', 'userManagement', 'templater'];

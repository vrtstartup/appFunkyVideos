import { keys, extend, find, reject } from 'lodash';

export default class SubtitlesController {
    constructor($log, srt, FileSaver, $sce, $scope, videogular, Upload, $timeout, hotkeys, toast) {
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

        this.file = {};
        this.movieUploaded = false;
        this.movieSubmitted = false;
        this.emailRecipient = '';
        this.progressPercentage = '';
        this.form = {};
        this.slider = {};
        this.subtitles = [];
        this.currentTime = '';
        this.currentSubtitlePreview = '';



        this.$scope.$watchCollection('vm.form', (newValues, oldValues) => {
            if (newValues === oldValues) {
                return;
            }

            this.updateSubtitles(newValues);
        }, true);

        this.$scope.$on('currentTime', (event, time) => {
            let currentSubtitle = find(this.subtitles, (subtitle) => {
                if (time >= subtitle.start && time <= subtitle.end) return subtitle.text;
            });

            this.currentSubtitlePreview = currentSubtitle ? currentSubtitle.text || '' : '';
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
                this.videogular.api.seekTime(this.form.start - 3 / 1000);
            }
        });



    }

    updateSubtitles(newValues) {
        if(!newValues.text) {
            this.deleteSubtitle(this.form);
            return;
        }

        //check if value.id exists, else push object to array with new ID
        if (!this.form.id && this.form.text) {
            this.resetEditMode();
            this.form.id = this.getNewSubtitleId();
            this.form.isEditmode = true;
            this.subtitles.push(this.form);
        }

        //update existing array with object changes
        this.subtitles.map((subtitle) => {
            if (subtitle.id === this.form.id) {
                return extend(subtitle, this.form);
            }
        });
    }


    setIn() {
        this.form.start = this.videogular.api.currentTime / 1000;
    }


    setOut() {
        this.form.end = this.videogular.api.currentTime / 1000;
    }



    addSubtitle() {
        let lastTitle = this.form.end;
        this.form = {
            id: '',
            start: lastTitle + 0.1,
            end: lastTitle + 2,
            text: '',
            isEditmode: false,
        }
    }

    editSubtitle(subtitle) {
        this.resetEditMode();

        this.form = {
            id: subtitle.id,
            start: subtitle.start,
            end: subtitle.end,
            text: subtitle.text,
            isEditmode: true,
        }
    }

    resetEditMode() {
        this.subtitles = angular.forEach(this.subtitles, (sub) => {
            sub.isEditmode = false;
        });
    }

    previewSubtitles() {
        this.form = {
            id: '',
            start: '',
            end: '',
            text: '',
            isEditmode: false,
        }
    }

    deleteSubtitle(sub) {
        this.subtitles = reject(this.subtitles, (subtitle) => {
            return subtitle.id === sub.id;
        });
    }

    renderSubtitles() {
        this.movieSubmitted = true;
        let srtString = this.srt.stringify(this.subtitles);
        let srtFile = new Blob([srtString], {
            type: 'srt'
        });
        let srtFileName = this.file.fileName + '.srt';

        this.upload(srtFile, srtFileName, this.emailRecipient);
    }

    //#TODO make 100% unique
    getNewSubtitleId() {
        return Math.random().toString(16).slice(2);
    }

    //upload file to server, get media duration to init sliders
    upload(file, name, email) {
        if (file.type === "video/mp4") {
            //set duration of video, init slider values
            this.Upload.mediaDuration(file).then((durationInSeconds) => {
                durationInSeconds = Math.round(durationInSeconds * 1000) / 1000;
                this.form.start = 0.001;
                this.form.end = durationInSeconds / 10;

                this.slider = {
                    min: 0,
                    max: durationInSeconds,
                    options: {
                        id: 'main',
                        floor: 0,
                        ceil: durationInSeconds,
                        precision: 3,
                        step: 0.001,
                        draggableRange: true,
                        keyboardSupport: true
                    }
                };
            });
        }

        //upload video, show player and sliders, or upload subtitle to finalize
        this.Upload.upload({
                url: 'api/subtitleVideos',
                data: { file: file, fileName: name, email: email },
                method: 'POST',
            })
            .then((resp) => {
                if(resp.data.processing) {
                    this.toast.showToast('success', 'Uw video wordt verwerkt door onze servers, <br>' +
                        'zodra deze klaar is ontvangt u een e-mail  <br> met een link om het resultaat te downloaden.');
                    return;
                }

                this.movieUploaded = true;
                this.file.tempUrl = resp.data.url;
                this.file.fileName = resp.data.name;
            }, (resp) => {
                console.log('Error: ' + resp.error);
                console.log('Error status: ' + resp.status);
            }, (evt) => {
                this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
    }
}

SubtitlesController.$inject = ['$log', 'srt', 'FileSaver', '$sce', '$scope', 'videogular', 'Upload', '$timeout', 'hotkeys', 'toast'];
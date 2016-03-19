import {keys} from 'lodash';
export default class SubtitlesController {
    constructor($log, srt, FileSaver, $sce, $scope, videogular, Upload, $timeout) {
        this.$log = $log;
        this.$sce = $sce;
        this.srt = srt;
        this.$scope = $scope;
        this.FileSaver = FileSaver;
        this.videogular = videogular;
        this.isReadyForProcess = false;
        this.movieUploaded = false;
        this.Upload = Upload;
        this.$timeout = $timeout;

        this.uploadedMovieUrl = '';
        this.progressPercentage = '';
        this.srtObj = {};
        this.form = {};
        this.slider = {};
    }

    upload(file, name, email) {
        //set duration of video, init slider values
        this.Upload.mediaDuration(file).then((durationInSeconds) => {
            durationInSeconds = Math.round(durationInSeconds * 1000) / 1000;
            this.form.start = 0;
            this.form.end = durationInSeconds;

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

        //upload video, show player and sliders
        this.Upload.upload({
            url: 'api/subtitleVideos',
            data: {file: file, fileName: name, email: email},
            method: 'POST',
        })
        .then((resp) => {
            this.uploadedMovieUrl = resp.data.url;
            this.movieUploaded = true;
            file.url = resp.data.url;
            file.nm = resp.data.name;
            file.subtitled = resp.data.subtitled;
        }, (resp) => {
            console.log('Error: ' + resp.error);
            console.log('Error status: ' + resp.status);
        }, (evt) => {
            this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        });
    }

    createSRT(srtObj) {
        for(let i = 0; i <  keys(srtObj).length; i++) {
            srtObj[i].end = this.checkIfDecimal(srtObj[i].end);
            srtObj[i].start = this.checkIfDecimal(srtObj[i].start);
        }
        return this.srt.stringify(srtObj);
    }


    downloadSRTFile(srtObj) {
        const srtString = this.createSRT(srtObj);
        const email = this.subtitle.email;
        const name =  this.$scope.f.nm + '.srt';
        const data = new Blob([srtString], {
            type: 'srt',
        });

        //this.FileSaver.saveAs(data, name);
        this.upload(data, name, email);
        this.isReadyForProcess = true;

    }

    addLine(obj) {
        this.totalTime = this.videogular.api.currentTime / 1000.0;
        var id = Object.keys(this.srtObj).length++;
        this.srtObj[id] = {id: id, start: obj.start, end: obj.end, text: obj.text};
    }

    checkIfDecimal(a) {
        if (a%1 === 0) {
            return a - 0.001;
        }
        if (a === 0) {
            return a + 0.001;
        }
        return a;
    }

    logTime(time, duration) {
        console.log('playhead updating', time);
    }

    setIn() {
        this.form.start = this.form.start - 0.1;
    }


    setOut() {
        this.form.end = this.form.end + 0.1;
    }

    // hotkeys.add({
    //     combo: 'ctrl+i',
    //     description: 'getInTime',
    //     callback: function() {
    //         setIn();
    //     }
    // });

    // hotkeys.add({
    //     combo: 'ctrl+o',
    //     description: 'getOutTime',
    //     callback: function() {
    //         setOut();
    //     }
    // });


}

SubtitlesController.$inject = ['$log', 'srt', 'FileSaver', '$sce', '$scope', 'videogular', 'Upload', '$timeout'];

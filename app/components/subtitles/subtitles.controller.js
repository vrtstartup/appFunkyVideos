import {keys} from 'lodash';
export default class SubtitlesController {
    constructor($log, srt, FileSaver, $sce, $scope, videogular, Upload, $timeout) {
        this.$log = $log;
        this.$sce = $sce;
        this.srt = srt;
        this.$scope = $scope;
        this.FileSaver = FileSaver;
        this.srtObj = {};
        this.videogular = videogular;
        this.isReadyForProcess = false;
        this.Upload = Upload;
        this.$timeout = $timeout;
        this.slider = {};


        this.$scope.$on('sliderChanged', (message, sliderId, modelValue, highValue) => {
            this.changeSlider(sliderId, modelValue, highValue);
            console.log(modelValue, highValue);
            this.form.start = modelValue;
            this.form.end = highValue;
        });


        //if (isNaN(this.form.end) || isNaN(this.form.start)) {
        //    this.form.end = 0;
        //    this.form.start = 0;
        //}

    }

    upload(file, name, email) {
        this.$scope.f = file;

        console.log('FILE', file);

        this.Upload.upload({
            url: 'api/subtitleVideos',
            data: {file: file, fileName: name, email: email},
            method: 'POST',
        }).then((resp) => {
            console.log('RESP', resp.data);
            file.url = resp.data.url;
            file.nm = resp.data.name;
            file.subtitled = resp.data.subtitled;
        }, (resp) => {
            console.log('Error: ' + resp.error);
            console.log('Error status: ' + resp.status);
        }, (evt) => {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });

        this.Upload.mediaDuration(file).then((durationInSeconds) => {
            this.slider = {
                min: 0,
                max: durationInSeconds,
                options: {
                    id: 'test',
                    floor: 0,
                    ceil: durationInSeconds,
                    precision: 10,
                    step: 0.00001,
                    draggableRange: true
                }
            };

            this.$timeout(() => {
                console.log('setting start and end');
                this.form.start = 0;
                this.form.end = durationInSeconds;
            }, 1000);
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


    changeSlider(id, start, end) {
        if(!start) return;
        this.videogular.api.seekTime(start);
    }


    setIn() {
        this.form.start = this.videogular.api.currentTime / 1000.0;
    }


    setOut() {
        this.form.end = this.videogular.api.currentTime / 1000.0;
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

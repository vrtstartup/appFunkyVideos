import {keys} from 'lodash';
export default class SubtitlesController {
    constructor($log, srt, FileSaver, $sce, $scope, videogular, Upload) {
        this.$log = $log;
        this.$sce = $sce;
        this.srt = srt;
        this.$scope = $scope;
        this.FileSaver = FileSaver;
        this.srtObj = {};
        this.videogular = videogular;

        this.Upload = Upload;

        this.slider = {
            options: {
                id: 'main',
                ceil: this.videogular.api.totalTime / 1000,
                step: 0.001,
                precision: 10,
                draggableRange: true,
                noSwitching: true,
                onChange: this.changeSlider,
            }

        };

        this.$scope.$on('sliderChanged', (message, sliderId, modelValue, highValue) => {
            this.changeSlider(sliderId, modelValue, highValue);
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

        //if(isNaN(this.slider.options.ceil)) {
            this.Upload.mediaDuration(file).then((durationInSeconds) =>{
                this.slider.options.ceil = durationInSeconds;
                this.form.end =  durationInSeconds;
            });
        //}


    }


    srcChanged() {

        this.form = {
            start: 0.001,
            end: this.videogular.api.totalTime / 1000,
            text: 'test text'
        };

        this.slider = {
            options: {
                id: 'main',
                floor: 0.001,
                ceil: this.videogular.api.totalTime / 1000,
                step: 0.001,
                precision: 10,
                draggableRange: true,
                noSwitching: true,
                onChange: this.changeSlider.bind(this),
            },
        };
        this.changeSlider();
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

        console.log('Email', email);

        const name =  this.$scope.f.nm + '.srt';
        const data = new Blob([srtString], {
            type: 'srt',
        });

        //this.FileSaver.saveAs(data, name);
        this.upload(data, name, email);
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

SubtitlesController.$inject = ['$log', 'srt', 'FileSaver', '$sce', '$scope', 'videogular', 'Upload'];

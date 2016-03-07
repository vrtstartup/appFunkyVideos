export default class SubtitlesController {
    constructor($log, srt, FileSaver, $sce, $scope, videogular, Upload) {
        this.$log = $log;
        this.$sce = $sce;
        this.srt = srt;
        this.$scope = $scope;
        this.FileSaver = FileSaver;
        this.srtObj = {};
        this.videogular = videogular;
        this.subtitle = {
            video: 'temp/videos/am1.mov'
        };
        const that = this;
        this.Upload = Upload;

        this.slider = {
            options: {
                id: 'main',
                floor: 0,
                ceil: this.videogular.api.totalTime / 1000,
                step: 0.001,
                precision: 10,
                draggableRange: true,
                noSwitching: true,
                onChange: this.changeSlider,
            }

        };

        this.$scope.$on('sliderChanged', (message, sliderId, modelValue, highValue) => {
            console.log('sliderChanged');
            this.changeSlider(sliderId, modelValue, highValue);
            this.form.start = modelValue;
            this.form.end = highValue;
        });


        //$scope.upload = function (file) {
        //
        //    $scope.f = file;
        //
        //    Upload.upload({
        //        url: 'api/subtitleVideos',
        //        data: {file: file, 'username': $scope.username},
        //        method: 'POST',
        //    }).then(function (resp) {
        //        file.url = resp.data.url;
        //
        //
        //        that.srcChanged();
        //    }, function (resp) {
        //        console.log('Error status: ' + resp.status);
        //    }, function (evt) {
        //        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        //        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        //    });
        //
        //};

        //this.upload();

    }

    upload(file) {

        this.$scope.f = file;

        this.Upload.upload({
            url: 'api/subtitleVideos',
            data: {file: file, 'username': this.$scope.username},
            method: 'POST',
        }).then((resp) => {
            file.url = resp.data.url;
        }, (resp) => {
            console.log('Error status: ' + resp.status);
        }, (evt) => {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });

        if(isNaN(this.slider.options.ceil)) {
            console.log('upload', this.slider.options.ceil);
            this.Upload.mediaDuration(file).then((durationInSeconds) =>{
                this.slider.options.ceil = durationInSeconds;
                this.form.end =  durationInSeconds;
                console.log('upload durationInSeconds', this.slider.options.ceil);
            });
        }


    }


    srcChanged() {
        console.log('srcChanged', this);


        this.form = {
            start: 0,
            end: this.videogular.api.totalTime / 1000,
            text: 'test text'
        };

        this.slider = {
            options: {
                id: 'main',
                floor: 0,
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
        return this.srt.stringify(srtObj);
    }


    downloadSRTFile(srtObj) {
        var srtString = this.createSRT(srtObj);
        var data = new Blob([srtString], {
            type: 'srt'
        });

        this.FileSaver.saveAs(data, 'sub.srt');
    }

    addLine(obj) {
        this.totalTime = this.videogular.api.currentTime / 1000.0;
        var id = Object.keys(this.srtObj).length++;
        this.srtObj[id] = { id: id, start: obj.start, end: obj.end, text: obj.text };
    }

    changeSlider(id, start, end) {
        return this.videogular.api.seekTime(start);
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

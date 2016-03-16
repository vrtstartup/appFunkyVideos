import template from './track.directive.html';

class TrackDirectiveController {
    constructor($scope, $log, $element, $document) {
        this.$log = $log;
        this.$element = $element;
        this.$scope = $scope;
        this.ctx = new AudioContext();
        const audio = this.$element[0].querySelector('audio');
        this.analyser = this.ctx.createAnalyser();

        this.trackVolume = 100;
        this.loading = true;

        //this.track = {};
        this.canvas = this.$element[0].querySelector('canvas');
        //this.sound = {};

        this.canvasWidth = 600;
        this.canvasHeight = 200;
        this.freqShowPercent = 0.75;
        this.fftSize = 256;
        this.freqCount = this.fftSize / 2;
        this.freqDrawWidth = this.canvasWidth / (this.freqCount * this.freqShowPercent);
        this.timeDrawWidth = this.canvasWidth / this.freqCount;

        console.log("trackSrc", this.trackSrc);
        console.log("trackName", this.trackName);
        this.track = {};

        this.init();
    }

    init() {
        this.initCanvas();
        this.loadSound(this.trackSrc);
    }

    initCanvas() {
        this.track.canvas = this.canvas;
        this.track.canvas.width = this.canvasWidth;
        this.track.canvas.height = this.canvasHeight;

        this.track.cCtx = this.track.canvas.getContext('2d');

        var gradient = this.track.cCtx.createLinearGradient(0, 0, 0, this.canvasHeight);
        gradient.addColorStop(0.15, '#e81717');
        gradient.addColorStop(0.75, '#7943cb');
        gradient.addColorStop(1, '#005392');
        this.track.cCtx.fillStyle = gradient;

        this.track.cCtx.strokeStyle = '#AAA';
    }

    play(buffer) {

        console.log("buffer",buffer);
        //audioTrack.play();
        //this.analyser = audioTrack.analyser;
        console.log('play');
        this.source = this.ctx.createBufferSource();
        this.source.buffer = buffer;
        this.analyser.connect(this.ctx.destination);
        this.source.connect(this.analyser);
        this.source.start(0);
        this.visualize();
    }

    loadSound(url) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        request.onload = () => {
            // request.response is encoded... so decode it now
            this.ctx.decodeAudioData(request.response, (buffer) => {
                    this.sound = buffer;

                    //setTimeout(() => {
                        console.log('decodeAudioData buffer', buffer);
                    //}, 1500);
                }, function(err) {
                    console.log('Error', err);
                }
            );
        };

        request.send()
    }

    visualize() {

        this.analyser.fftSize = 2048;
        this.bufferLength = this.analyser.frequencyBinCount; // half the FFT value
        this.dataArray = new Uint8Array(this.bufferLength); // create an array to store the data

        this.track.cCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        this.draw();
    }

    draw(){

        this.drawVisual = requestAnimationFrame(this.draw);

        this.analyser.getByteTimeDomainData(this.dataArray); // get waveform data and put it into the array created above

        this.track.cCtx.beginPath();

        var sliceWidth = this.canvasWidth * 1.0 / this.bufferLength;
        var x = 0;

        for(var i = 0; i < this.bufferLength; i++) {

            var v = this.dataArray[i] / 128.0;
            var y = v * this.canvasHeight/4;

            if(i === 0) {
                this.track.cCtx.moveTo(x, y);
            } else {
                this.track.cCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        this.track.cCtx.lineTo(this.canvasWidth, this.canvasHeight/4);
        this.track.cCtx.stroke();

        var dataURL =  this.canvas.toDataURL();

        // set canvasImg image src to dataURL
        // so it can be saved as an image
        this.canvas.src = dataURL;
    }


}

export const trackDirective = function() {
    return {
        restrict: 'AE',
        template: template,
        scope: {},
        controller: TrackDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            trackSrc: '@',
            trackName: '@'
        },
    };
};

TrackDirectiveController.$inject = ['$scope', '$log', '$element', '$document'];

import template from './videoPlayer.directive.html';

class VideoPlayerDirectiveController {
    constructor($scope, $sce, videogular) {
        this.$sce = $sce;
        this.$scope = $scope;
        this.videogular = videogular;
        this.config = {};

        $scope.$watch('source', (value) => {
            if (!value) return;

            let videoSource = this.$sce.trustAsResourceUrl(value);

            this.config = {
                sources: [{ src: videoSource, type: 'video/mp4' }],
                cuePoints: {
                    range: [{
                        timeLapse: {
                            start: 0.001,
                            end: 5.001
                        },
                        onComplete: this.onCompleteRangeCuepoint.bind(this),
                        onProgress: this.changeTime.bind(this),
                        onChangeSource: this.setTimeSlider()


                    }]
                }
            };
        });





        $scope.$watch('loop', (value) => {
            this.looping = value;
        });


        $scope.$watch('videogular.api.totalTime', (value) => {
            console.log(value);
        });


        $scope.$watchCollection('[start, end]', (values, oldValues) => {
            if (!values) return;

            let startChanged = values[0] !== oldValues[0];

            if (startChanged && this.videogular.api) {

                this.videogular.api.seekTime(values[0]);
                this.videogular.api.play();
            }

            if (values[0] && values[1]) {
                this.config.cuePoints = {
                    range: [{
                        timeLapse: {
                            start: values[0],
                            end: values[1]
                        },
                        onComplete: this.onCompleteRangeCuepoint.bind(this)
                    }]
                };
            } else {
                this.config.cuePoints = {};
            }


        });

    }


    // TESTING

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


    setTimeSlider(totalTime) {
        console.log(totalTime);
        this.timeSlider = {
            min: 0,
            max: totalTime,
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
                        // Make the video follow when the range gets dragged
                        this.videogular.api.seekTime(time);

                    }
                },
                onEnd: () => {
                    this.videogular.api.play();
                },
                hideLimitLabels: true,

                floor: 0,
                ceil: totalTime,
                precision: 3,
                step: 0.001,
                draggableRange: true,
                keyboardSupport: true
            }
        };

    }

    // END OF TEST

    setTimes(currentTime) {
        this.$scope.$emit('currentTime', currentTime);
    }

    onUpdateState(state) {
        this.$scope.$emit('onUpdateState', state);
    }

    onPlayerReady(API) {
        this.videogular.onPlayerReady(API);

        console.log(this.videogular.api);
        console.log(this.videogular.api.timeLeft);
        this.setTimeSlider(this.videogular.api.totalTime);
    }

    onCompleteRangeCuepoint(currentTime, timeLapse) {
        if (this.looping === true) {
            this.videogular.api.seekTime(timeLapse.start);
        } else {
            // Do nothing if we don't want it to loop
        }
    }

    changeTime(currentTime) {
        console.log(currentTime);
        let timeInSeconds = currentTime / 1000;
        this.$scope.$emit('currentTime', timeInSeconds);
    }


}

export const videoPlayerDirective = function() {
    return {
        restrict: 'AE',
        template: template,
        scope: {
            source: '=',
            start: '=',
            end: '=',
            currentTime: '=',
            updateTime: '&',
            loop: '='
        },
        controller: VideoPlayerDirectiveController,
        controllerAs: 'vm',
    };
};

VideoPlayerDirectiveController.$inject = ['$scope', '$sce', 'videogular'];

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


                    }]
                }
            };
        });


        $scope.$watch('loop', (value) => {
            this.looping = value;
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


    setTimes(currentTime) {
        this.$scope.$emit('currentTime', currentTime);
    }

    onUpdateState(state) {
        this.$scope.$emit('onUpdateState', state);
    }

    onPlayerReady(API) {
        this.videogular.onPlayerReady(API);
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

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
                        // onProgress: this.changeTime.bind(this),
                    }]
                }
            };
        });


        $scope.$watch('loop', (value) => {
            this.looping = value;
            if (value === false && this.videogular.api) {
                this.activeSub = '';
                this.videogular.api.seekTime(0.001);
                this.videogular.api.play();
            }
        });

        $scope.$watch('subs', (value) => {
            this.subs = value;
        });

        $scope.$watchCollection('[start, end]', (values, oldValues) => {
            if (!values) return;
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

    updateTime(currentTime) {
        angular.forEach(this.subs, (value, key) => {
            if (value.start && currentTime >= value.start && currentTime <= value.end) {
                this.activeSub = value.text;
                console.log(value);
            }
        });
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
        }
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
            loop: '=',
            subs: '=',
        },
        controller: VideoPlayerDirectiveController,
        controllerAs: 'vm',
    };
};

VideoPlayerDirectiveController.$inject = ['$scope', '$sce', 'videogular'];

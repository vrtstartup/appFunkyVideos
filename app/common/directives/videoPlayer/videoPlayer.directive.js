import template from './videoPlayer.directive.html';

class VideoPlayerDirectiveController {
    constructor($scope, $sce, videogular) {
        this.$sce = $sce;
        this.$scope = $scope;
        this.videogular = videogular;
        this.config = {};
        this.totalTime = '';

        $scope.$watch('source', (value) => {
            if (!value) return;

            let videoSource = this.$sce.trustAsResourceUrl(value);

            this.config = {
                sources: [{ src: videoSource, type: 'video/mp4' }],
                cuePoints: {
                    range: [{
                        timeLapse: {
                            start: 10,
                            end: 50
                        },
                        onComplete: this.onCompleteRangeCuepoint.bind(this)
                    }]
                }
            };
        });

        $scope.$watch('[start, end]', (values, oldValues) => {
            if (!values) return;

            let startChanged =  values[0] !== oldValues[0];
            if (startChanged && this.videogular.api) {
                this.videogular.api.seekTime(values[0]);
                this.videogular.api.play();
            }

            this.config.cuePoints = {
                range: [{
                    timeLapse: {
                        start: values[0] || $scope.start,
                        end: values[1] || $scope.end
                    },
                    onComplete: this.onCompleteRangeCuepoint.bind(this)
                }]
            };
        });

        //$scope.$watch('start', (value) => {
        //    if (!value) return;
        //    this.videogular.api.seekTime(value);
        //    this.videogular.api.play();
        //
        //    this.config.cuePoints = {
        //        range: [{
        //            timeLapse: {
        //                start: value,
        //                end: $scope.end
        //            },
        //            onComplete: this.onCompleteRangeCuepoint.bind(this)
        //        }]
        //    };
        //});
        //
        //$scope.$watch('end', (value) => {
        //    if (!value) return;
        //    this.config.cuePoints = {
        //        range: [{
        //            timeLapse: {
        //                start: $scope.start,
        //                end: value
        //            },
        //            onComplete: this.onCompleteRangeCuepoint.bind(this)
        //        }]
        //    };
        //});
    }

    setTimes(currentTime, totalTime) {
        this.totalTime = totalTime;
        $scope.currentTime = currentTime;
    }

    onPlayerReady(API) {
        this.videogular.onPlayerReady(API);
    }

    onCompleteRangeCuepoint(currentTime, timeLapse) {
        this.videogular.api.seekTime(timeLapse.start);
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
            cueEndReached: '&'
        },
        controller: VideoPlayerDirectiveController,
        controllerAs: 'vm',
    };
};

VideoPlayerDirectiveController.$inject = ['$scope', '$sce', 'videogular'];

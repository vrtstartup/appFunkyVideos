import template from './videoSlider.directive.html';

class VideoSliderDirectiveController {
    constructor($scope, videogular) {
        this.$scope = $scope;

        this.videogular = videogular;
        this.totalTime = this.videogular.api.totalTime;

        // $scope.$watch('api', (value) => {
        //     this.api = value;


        //     this.setTimeSlider();
        // });



    }



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


    setTimeSlider() {
        this.timeSlider = {
            min: 0,
            max: this.api.totalTime,
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
                        this.api.seekTime(time);

                    }
                },
                onEnd: () => {
                    this.api.play();
                },
                hideLimitLabels: true,

                floor: 0,
                ceil: this.api.totalTime,
                precision: 3,
                step: 0.001,
                draggableRange: true,
                keyboardSupport: true
            }
        };

    }

}

export const videoSliderDirective = function() {
    return {
        restrict: 'AE',
        template: template,
        scope: {
            api: '='
        },
        controller: VideoSliderDirectiveController,
        controllerAs: 'vm',
    };
};

VideoSliderDirectiveController.$inject = ['$scope', 'videogular'];

// app.directive("hideMe", function ($animate) {
//     return function(scope, element, attrs) {
//         scope.$watch(attrs.hideMe, function(newVal) {
//             if (newVal) {
//                 $animate.addClass(element, "fade");
//             } else {
//                 $animate.removeClass(element, "fade");
//             }
//         });
//     };
// });

import template from './test.directive.html';

class TestDirectiveController {
    constructor($scope, $log, $animate, $element, $http) {
        this.$log = $log;
        this.$http = $http;
        this.$element = $element;
        this.$scope = $scope;

        console.log('controller', this);

        $scope.$watch('vm.isHidden', (value) => {
            if (value) {
                console.log('test hidden', this);
                // $animate.addClass($element, "fade");
                 TweenMax.to(this.$element, 10, {width:496, onUpdate: this.takeScreenshot.bind(this), onUpdateParams: [this.$element]});
            } else {
                TweenMax.to(this.$element, 1, {width:0});
                // $animate.removeClass($element, "fade");
            }
        }, true);
    }

    takeScreenshot(element) {

        console.log('test takeScreenshot');
        const el = element.parent();
        html2canvas(el, {
            onrendered: (canvas) => {
                this.canvasToJPG(canvas, this.upload.bind(this));
            },
        });
    }

    test() {
        console.log('test 222');
        this.test2();
    }

    test2() {
        console.log('!!!!!!!!');
    }

    upload(data) {
        console.log(data);
        this.$http({
            method: 'POST',
            url: '/api/images',
            headers: {
                'Content-Type': 'image/jpeg'
            },
            data: data,
            transformRequest: []
        })
        .success(function() {
            console.log('image uploaded :)');
        })
        .error(function(err) {
            console.log('upload error', err);
        });
    }

    dataURItoBlob(dataURI) {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {
            type: 'image/jpeg'
        });
    }

    canvasToJPG(cvs, done) {
        var quality = 90; // jpeg quality

        if (cvs.toBlob) { // some browsers has support for toBlob
            cvs.toBlob(done, 'image/jpeg', quality / 100);
        }
        else{
            done(dataURItoBlob(cvs.toDataURL('image/jpeg', quality / 100)));
        }
    }
}

export const testDirective = function() {
    return {
        restrict: 'A',
        template: template,
        scope: {},
        controller: TestDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            isHidden: '=',
        },
    };
};

TestDirectiveController.$inject = ['$scope', '$log', '$animate', '$element', '$http'];

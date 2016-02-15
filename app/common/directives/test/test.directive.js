import template from './test.directive.html';

class TestDirectiveController {
    constructor($scope, $log, $element, $http) {
        this.$log = $log;
        this.$http = $http;
        this.$element = $element;
        this.$scope = $scope;


        $scope.$watch('vm.isHidden', (value) => {
            if (value) {
                TweenMax.to(this.$element, 10, {width:496, onUpdate: this.takeScreenshot.bind(this), onUpdateParams: [this.$element]});
            } else {
                TweenMax.to(this.$element, 1, {width:0});
            }
        }, true);
    }

    takeScreenshot(element) {
        const el = element.parent();
        html2canvas(el, {
            onrendered: (canvas) => {
                this.canvasToJPG(canvas, this.upload.bind(this));
            },
        });
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
        .success(() => {
            this.$log.info('image uploaded');
        })
        .error((err) => {
            this.$log.error('upload error', err);
        });
    }

    dataURItoBlob(dataURI) {
        const binary = atob(dataURI.split(',')[1]);
        const array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {
            type: 'image/jpeg'
        });
    }

    canvasToJPG(cvs, done) {
        const quality = 90; // jpeg quality

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

TestDirectiveController.$inject = ['$scope', '$log', '$element', '$http'];

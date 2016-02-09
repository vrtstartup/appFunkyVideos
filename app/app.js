var app = angular.module("app", ["ngAnimate"]);

app.controller("AppCtrl", function($http, $scope) {
    this.isHidden = false;
    this.fadeIt = function() {
        this.isHidden = !this.isHidden;
    };

});

app.directive("hideMe", function($animate) {
    return function(scope, element, attrs) {
        scope.$watch(attrs.hideMe, function(newVal) {
            if (newVal) {
                $animate.addClass(element, "fade");
            } else {
                $animate.removeClass(element, "fade");
            }
        });
    };
});

app.animation(".fade", function($document, $window, $http) {
    return {
        addClass: function(element, className) {
            TweenMax.to(element, 50, {width:496, onUpdate: takeScreenshot, onUpdateParams: [element]});
        },
        removeClass: function(element, className) {
            TweenMax.to(element, 1, {width:0});
        }
    };

    function takeScreenshot(element) {
        const el = element.parent();
        html2canvas(el, {
            onrendered: function(canvas) {
                canvasToJPG(canvas, upload);
            },
        });
    }

    function upload(data) {
        $http.post('/api/images', {
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

    function dataURItoBlob(dataURI) {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {
            type: 'image/jpeg'
        });
    }

    function canvasToJPG(cvs, done) {
        var quality = 90; // jpeg quality

        if (cvs.toBlob) { // some browsers has support for toBlob
            cvs.toBlob(done, 'image/jpeg', quality / 100);
        }
        else{
            done(dataURItoBlob(cvs.toDataURL('image/jpeg', quality / 100)));
        }
    }
});

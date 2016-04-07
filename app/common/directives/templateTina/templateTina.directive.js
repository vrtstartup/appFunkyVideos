import './templateTina.directive.scss';
import template from './templateTina.directive.html';

class TemplateTinaDirectiveController {
    constructor($scope, $element, videoGeneration, $document) {
        this.videoGeneration = videoGeneration;
        this.$element = $element;
        this.$document = $document;

        $scope.$watch('vm.isReady', (value) => {
            if (!value) return;
            if (this.isReady){
                this.videoGeneration.takeScreenshot(this.$element, true);
                this.isReady = !this.isReady;
            }
        });

        $scope.$watch('vm.image', (value) => {
            if (!value) return;
            //console.log('Image', this.image);

            var imgObj  = angular.element('<img/>')
                .attr('src', this.image);

            var imgW = imgObj[0].width;
            var imgH = imgObj[0].height;

            this.$element.append(imgObj);

            var canvas = angular.element('<canvas/>')
                .addClass('cnvs')
                .css('width', imgW + 'px')
                .css('height', imgH  + 'px');
            this.$element.append(canvas);

            var canvasContext = canvas[0].getContext('2d');

            console.log('imgObj', imgObj);


            //canvas.width = imgW;
            //canvas.height = imgH;

            console.log(canvas[0].width);

            canvasContext.drawImage(imgObj[0], 0, 0, imgW, imgH,
                0, 0, canvas[0].width, canvas[0].height);

            var imgPixels = canvasContext.getImageData(0, 0, imgW, imgH);

            console.log('imgPixels', imgPixels);


            for(var y = 0; y < imgPixels.height; y++){
                for(var x = 0; x < imgPixels.width; x++){
                    var i = (y * 4) * imgPixels.width + x * 4;
                    var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
                    imgPixels.data[i] = avg;
                    imgPixels.data[i + 1] = avg;
                    imgPixels.data[i + 2] = avg;
                }
            }

            canvasContext.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);

            var url = canvas[0].toDataURL('image/png');

            var blob = this.videoGeneration._canvasToBlob(url);

            console.log('BLOB', blob);

            //this.Newimage = blob;

        });
    }
}

export const templateTinaDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateTinaDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            isReady: '=',
            image: '=',
            authorName: '=',
            authorTitle: '=',
            isHiddenSign: '=',
        },
    };
};

TemplateTinaDirectiveController.$inject = ['$scope', '$element', 'videoGeneration', '$document'];

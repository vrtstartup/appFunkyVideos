export default class VideoGenerationService {
    constructor($log, $http) {

        this.name = 'VideoGenerationService';
        //console.log('VideoGenerationService', this);

        const that = this;
        that.$http = $http;
        that.$log  = $log;

        that.test = function () {
            console.log('test');
        }

        this.getName = function() {
            that.test();
            return this.name;
        }

        this.takeScreenshot = function(element) {
            console.log('takeScreenshot this', that);
            const el = element.parent();
            html2canvas(el, {
                onrendered: (canvas) => {
                    console.log('onrendered this', canvas);
                    that._canvasToJPG(canvas, that._upload.bind(this));
                },
            });
        }

        that._upload = function(data) {
            console.log(data);
            that.$http({
                    method: 'POST',
                    url: '/api/images',
                    headers: {
                        'Content-Type': 'image/jpeg'
                    },
                    data: data,
                    transformRequest: []
                })
                .success(() => {
                    that.$log.info('image uploaded');
                })
                .error((err) => {
                    that.$log.error('upload error', err);
                });
        }

        that._dataURItoBlob = function(dataURI) {
            const binary = atob(dataURI.split(',')[1]);
            const array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {
                type: 'image/jpeg'
            });
        }

        that._canvasToJPG = function(cvs, done) {
            console.log('_canvasToJPG', cvs);
            const quality = 90; // jpeg quality

            if (cvs.toBlob) { // some browsers has support for toBlob
                cvs.toBlob(done, 'image/jpeg', quality / 100);
            }
            else{
                done(that._dataURItoBlob(cvs.toDataURL('image/jpeg', quality / 100)));
            }
        }



    }
}

VideoGenerationService.$inject = ['$log', '$http'];
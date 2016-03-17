// TODO: refactoring that=this bullshit

export default class VideoGenerationService {
    constructor($log, $http, $rootScope) {
        const that = this;
        that.$http = $http;
        that.$log  = $log;
        that.$rootScope = $rootScope;
        that.isTemplate = false;

        this.takeScreenshot = function(element, isTemplate) {
            //console.log('isTemplate', isTemplate);
            that.isTemplate = isTemplate;
            const el = element.parent();
            html2canvas(el, {
                onrendered: (canvas) => {
                    that._canvasToJPG(canvas, that._upload.bind(this));
                },
            });
        };

        that._upload = function(data) {
            //console.log('isTemplate 2', that.isTemplate);
            let url = '/api/images';
            let content = 'image/jpeg';

            if (that.isTemplate) {
                url = '/api/templates';
                content = 'image/png';
            }

            that.$http({
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': content
                    },
                    data: data,
                    transformRequest: []
                })
                .success((res) => {
                    that.$log.info('image uploaded', res);
                    that.$rootScope.template_url = res.template_url;
                })
                .error((err) => {
                    that.$log.error('upload error', err);
                });
        };

        that._dataURItoBlob = function(dataURI) {
            const binary = atob(dataURI.split(',')[1]);
            const array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {
                type: 'image/jpeg'
            });
        };

        that._canvasToJPG = function(cvs, done) {
            const quality = 90; // jpeg quality

            if (cvs.toBlob) { // some browsers has support for toBlob
                cvs.toBlob(done, 'image/jpeg', quality / 100);
            }
            else{
                done(that._dataURItoBlob(cvs.toDataURL('image/jpeg', quality / 100)));
            }
        };

    }
}

VideoGenerationService.$inject = ['$log', '$http', '$rootScope'];
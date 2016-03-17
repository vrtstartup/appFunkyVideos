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
            let contentType = 'image/jpeg';

            if (that.isTemplate) {
                url = '/api/templates';
                contentType = 'image/png';
            }

            that.$http({
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': contentType
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
            let contentType = 'image/jpeg';
            if (that.isTemplate) {
                contentType = 'image/png';
            }
            const binary = atob(dataURI.split(',')[1]);
            const array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {
                type: contentType
            });
        };

        that._canvasToJPG = function(cvs, done) {
            let contentType = 'image/jpeg';
            if (that.isTemplate) {
                contentType = 'image/png';
            }

            if (cvs.toBlob) { // some browsers has support for toBlob
                cvs.toBlob(done, contentType);
            }
            else{
                done(that._dataURItoBlob(cvs.toDataURL(contentType, 1.0)));
            }
        };

    }
}

VideoGenerationService.$inject = ['$log', '$http', '$rootScope'];
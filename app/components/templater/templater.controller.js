export default class TemplaterController {
    constructor($log, $rootScope, $http, Upload) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$http = $http;
        this.Upload = Upload;
        this.fileUploaded = false;
        this.fileUploading = false;

        this.templater = {};
    }

    upload(file) {
        this.fileUploading = true;
        this.Upload.upload({
            url: 'api/templaterVideo',
            data: {file: file},
            method: 'POST',
        }).then((resp) => {
            this.fileUploaded = true;
            this.fileUploading = false;
        }, (resp) => {
            console.log('Error status: ' + resp.status);
        }, (evt) => {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    }
}

TemplaterController.$inject = ['$log', '$rootScope', '$http', 'Upload'];

export default class TemplaterController {
    constructor($log, $rootScope, $http, Upload, toast) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$http = $http;
        this.Upload = Upload;
        this.toast = toast;
        this.fileUploaded = false;
        this.fileUploading = false;
        this.form = {};
        this.templater = {};

        this.template = 1;
        this.templates = [{
            id: 1,
            name: 'Titel + 2 tekstblokken'
        }, {
            id: 2,
            name: 'Titel + 3 tekstblokken'
        }, {
            id: 3,
            name: 'Titel + 4 tekstblokken'
        }];
    }

    //restrict file type
    upload(file) {
        this.fileUploading = true;
        this.Upload.upload({
            url: 'api/templaterVideo',
            data: {file: file},
            method: 'POST',
        }).then((resp) => {
            this.fileUploaded = true;
            this.fileUploading = false;
            this.form.filename = resp.data.filename;
        }, (resp) => {
            this.toast.showToast('error', resp.status);
        }, (evt) => {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    }

    sendToZapier() {
        if(!this.form) {
            this.toast.showToast('error', 'please fill in the required fields');
            return;
        }

        let _template;
        switch (this.template) {
            case 1:
                _template = 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\01_templater\\win_ae\\Template_Text_02.aep';
                break;
            case 2:
                _template = 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\01_templater\\win_ae\\Template_Text_03.aep';
                break;
            case 3:
                _template = 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\01_templater\\win_ae\\Template_Text_04.aep';
                break;
            default:
                _template = 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\01_templater\\win_ae\\Template_Text_02.aep';
        }

        this.$http({
            method: 'GET',
            url: 'https://zapier.com/hooks/catch/2mep75/',
            params: {
                'render-status': 'ready',
                'target': 'Export Composition',
                'template': _template,
                'title': this.form.title ? this.form.title.toUpperCase() : '',
                'filename': this.form.filename ? this.form.filename : '',
                'textOne': this.form.textOne ? this.form.textOne.toUpperCase() : '',
                'textTwo': this.form.textTwo ? this.form.textTwo.toUpperCase() : '',
                'textThree': this.form.textThree ? this.form.textThree.toUpperCase() : '',
                'textFour': this.form.textFour ? this.form.textFour.toUpperCase() : ''
            }
        }).then(() => {
            this.toast.showToast('success', 'video is being processed and will soon be available for download');
            this.resetForm();
        }, (response) => {
            this.toast.showToast('error', response);
        });
    }

    resetForm() {
        this.form = {
            title: '',
            filename: '',
            textOne: '',
            textTwo: '',
            textThree: '',
            textFour: ''
        }
    }
}

TemplaterController.$inject = ['$log', '$rootScope', '$http', 'Upload', 'toast'];

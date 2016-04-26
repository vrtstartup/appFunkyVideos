export default class DownloadController {
    constructor($log, $http, $stateParams) {
        this.$log  = $log;
        this.$http = $http;

        this.filename = $stateParams.filename;
        this.url = '';
        this.isStarted = false;

    }

    downloadVideo(url) {
        console.log('download', url);
        this.isStarted = true;

        this.$http.post('/api/download', { 'url' : url }).then((res) => {
            console.log('Success', res.data.url);
            this.url = res.data.url;
        }, (err) => {
            console.log('Error', err);
        });

    }
}

DownloadController.$inject = ['$log', '$http', '$stateParams'];

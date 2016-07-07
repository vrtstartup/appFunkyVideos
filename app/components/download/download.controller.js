export default class DownloadController {
    constructor($log, $http, $stateParams, $firebaseAuth) {
        this.$log  = $log;
        this.$http = $http;
        this.firebaseAuth = $firebaseAuth();

        this.filename = $stateParams.filename;
        this.url = '';
        this.isStarted = false;

        this.firebaseAuth.$onAuthStateChanged((authData) => {
            if (authData) {
                this.email = authData.password.email;
            }
        });
    }

    downloadVideo(url) {
        console.log('download', url);
        this.isStarted = true;

        this.$http.post('/api/download', { url : url, email: this.email }).then((res) => {
            console.log('Success', res.data.url);
            this.url = res.data.url;
        }, (err) => {
            console.log('Error', err);
        });

    }
}

DownloadController.$inject = ['$log', '$http', '$stateParams', '$firebaseAuth'];

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
        this.isStarted = true;

        this.$http.post('/api/download', { url : url, email: this.email }).then((res) => {
            this.url = res.data.url;
        }, (err) => {
        });

    }
}

DownloadController.$inject = ['$log', '$http', '$stateParams', '$firebaseAuth'];

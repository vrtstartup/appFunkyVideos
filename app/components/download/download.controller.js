export default class DownloadController {
    constructor($log, $http, $stateParams) {
        this.$log  = $log;
        this.$http = $http;

        console.log('$stateParams', $stateParams);

        this.filename = $stateParams.filename;
    }
}

DownloadController.$inject = ['$log', '$http', '$stateParams'];

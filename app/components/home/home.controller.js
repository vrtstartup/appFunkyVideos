export default class HomeController {
    constructor($log, $http, $scope, $timeout) {
        this.$log = $log;
        this.$http = $http;
        this.$scope = $scope;
        this.$timeout = $timeout;


    }

}

HomeController.$inject = ['$log', '$http', '$scope', '$timeout'];

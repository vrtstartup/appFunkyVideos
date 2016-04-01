export default class Controller {
    constructor($log, $http, $scope) {
        this.$log = $log;
        this.$scope = $scope;
        this.isReady = false;

        this.place = 'Belgium';

    }

    getPicture() {
        this.isReady = !this.isReady;
    }
}

Controller.$inject = ['$log', '$http', '$scope'];
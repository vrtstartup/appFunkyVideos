export default class Controller {
    constructor($log, $http) {
        this.$log = $log;
        this.isReady = false;




    }


    getPicture() {
        this.isReady = !this.isReady;
    }



}

Controller.$inject = ['$log', '$http'];
export default class Controller {
    constructor($log, $http) {
        this.$log = $log;
        this.isReady = false;
        this.lat = 50.870593;
        this.lng = 4.343855;
        this.zoom = 12;





    }


    getPicture() {
        this.isReady = !this.isReady;
    }



}

Controller.$inject = ['$log', '$http'];
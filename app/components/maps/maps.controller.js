export default class Controller {
    constructor($log, $http, $scope) {
        this.$log = $log;
        this.$scope = $scope;
        this.isReady = false;
        this.lat = 0;
        this.lng = 0;
        this.zoom = 12;
        this.place = 'Severodvinsk';

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                $scope.$apply(() => {
                    this.lat = Math.round(position.coords.latitude * 1e6 ) / 1e6;
                    this.lng = Math.round(position.coords.longitude * 1e6 ) / 1e6;
                });
            });
        }
    }

    getPicture() {
        this.isReady = !this.isReady;
    }
}

Controller.$inject = ['$log', '$http', '$scope'];
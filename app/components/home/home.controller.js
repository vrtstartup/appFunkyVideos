export default class HomeController {
    constructor($log, $http, $interval, $scope) {
        this.$log = $log;
        this.$http = $http;
        this.isHidden = false;
        this.$scope = $scope;
        this.url = '';




    }

    fadeIt() {
        this.isHidden = !this.isHidden;
    }

    getVideo() {
        this.$http({
            method: 'GET',
            url: '/api/images'
            }).then( (res) => {
                this.url = res.data.video_url;
                return this.url;
            }, (err) => {
                console.error('Error', err);
            });
    }

}

HomeController.$inject = ['$log', '$http', '$interval', '$scope'];

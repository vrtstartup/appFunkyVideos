export default class HomeController {
    constructor($log, $http, $scope) {
        this.$log = $log;
        this.$http = $http;
        this.isHidden = false;

        console.log('Home HomeController');
    }

    fadeIt() {
        console.log('Home fade', this.isHidden);
        this.isHidden = !this.isHidden;
    }

    getVideo() {
        console.log('URL1', url);
        var url;
        this.$http({
            method: 'GET',
            url: '/api/images'
            }).then( function(res) {
                console.log('Success!', res.config.url);
                url = res.config.url;
                console.log('URL1', url);
            }, function errorCallback(err) {
                console.log('Error', err);
            });

    }

}

HomeController.$inject = ['$log', '$http', '$scope'];

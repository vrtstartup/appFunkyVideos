export default class HomeController {
    constructor($log, $http, $scope) {
        this.$log = $log;
        this.$http = $http;
        this.isHidden = false;
        this.url = '';

        console.log('Home HomeController', this.url);
    }

    fadeIt() {
        console.log('Home fade', this.isHidden);
        this.isHidden = !this.isHidden;
    }

    getVideo() {

        this.$http({
            method: 'GET',
            url: '/api/images'
            }).then( (res) => {
                console.log('Success!', res.data.video_url);
                this.url = res.data.video_url;
                console.log('URL1', this.url);
                return this.url;
            }, (err) => {
                console.log('Error', err);
            });
    }

}

HomeController.$inject = ['$log', '$http', '$scope'];

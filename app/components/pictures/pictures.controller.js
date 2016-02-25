export default class PicturesController {
    constructor($log, $rootScope, $http) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$http = $http;
        //What do you mean, 'booze ain't food'? I'd rather chop off my ding-dong than admit that!



    }

    getPicture() {
        this.isReady = true;
    }


}

PicturesController.$inject = ['$log', '$rootScope', '$http'];

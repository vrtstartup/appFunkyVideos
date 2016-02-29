export default class PicturesController {
    constructor($log, $rootScope, $http) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$http = $http;
        //What do you mean, 'booze ain't food'? I'd rather chop off my ding-dong than admit that!

        this.isMurderface = false;
        this.isWartooth = false;
        this.isSkwigelf = false;
        this.isReady = false;

        this.schemes = [
            {
            name: 'drd',
            },
            {
                name: 'ak',
            },
        ];


    }

    getPicture() {
        this.isReady = true;
    }

    showMurderface() {
        this.isMurderface = true;
        this.isWartooth = false;
        this.isSkwigelf = false;
        this.isReady = false;

    }

    showWartooth() {
        this.isMurderface = false;
        this.isWartooth = true;
        this.isSkwigelf = false;
        this.isReady = false;

    }

    showSkwigelf() {
        this.isMurderface = false;
        this.isWartooth = false;
        this.isSkwigelf = true;
        this.isReady = false;

    }


}

PicturesController.$inject = ['$log', '$rootScope', '$http'];

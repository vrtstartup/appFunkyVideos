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
        this.className = 'drd';
        this.showAvailiableTemplates = false;

        this.schemes = [
            {
                name: 'de redactie color scheme',
                className: 'drd',
                class: 'vrt-drd-btn',
            },
            {
                name: 'amerika kiest color scheme',
                className: 'ak',
                class: 'vrt-ak-btn',
            },
        ];

    }

    getScheme(scheme) {
        this.className = scheme.className;
        this.showAvailiableTemplates = true;
    }

    getPicture() {
        this.isReady = !this.isReady;
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

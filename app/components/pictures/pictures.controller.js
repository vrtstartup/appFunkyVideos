//TODO: refactor show functions
export default class PicturesController {
    constructor($log, $rootScope, $http) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$http = $http;
        //What do you mean, 'booze ain't food'? I'd rather chop off my ding-dong than admit that!
        this.selected = 0;
        this.className = 'drd';
        this.showAvailiableTemplates = false;

        this.resetAllTemplates();

        this.schemes = [
            {
                name: 'de redactie',
                className: 'drd',
                class: 'vrt-drd-btn',
            },
            {
                name: 'amerika kiest',
                className: 'ak',
                class: 'vrt-ak-btn',
            },
        ];

    }

    getScheme(scheme, index) {
        this.className = scheme.className;
        this.selected = index;
        console.log('Scheme', this.selected);


        this.showAvailiableTemplates = true;
    }

    getPicture() {
        this.isReady = !this.isReady;
    }

    showMurderface() {
        this.resetAllTemplates();
        this.isMurderface = true;
    }

    //showWartooth() {
    //    this.resetAllTemplates();
    //    this.isWartooth = true;
    //}

    showSkwigelf() {
        this.resetAllTemplates();
        this.isSkwigelf = true;
    }

    showPickels() {
        this.resetAllTemplates();
        this.isPickels = true;
    }

    showDethklok(templateClass, footerText) {
        this.resetAllTemplates();
        this.isDethklok = true;
        this.templateClass = templateClass;
        this.footerText = footerText;
    }

    showExplosion() {
        this.resetAllTemplates();
        this.isExplosion = true;
    }

    resetAllTemplates() {
        this.isMurderface = false;
        this.isWartooth = false;
        this.isSkwigelf = false;
        this.isExplosion = false;
        this.isReady = false;
        this.isPickels = false;
        this.isDethklok = false;
    }

}

PicturesController.$inject = ['$log', '$rootScope', '$http'];

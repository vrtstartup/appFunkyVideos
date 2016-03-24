//TODO: refactor show functions
export default class PicturesController {
    constructor($log, $rootScope, $http) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$http = $http;
        //What do you mean, 'booze ain't food'? I'd rather chop off my ding-dong than admit that!
        //this.selected;
        this.className = 'drd';

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

    getScheme(scheme) {
        //this.className = scheme;

        if(scheme === 'ak' ){
            this.showTempltesAK = !this.showTempltesAK;
        }
        if(scheme === 'drd' ){
            this.showTempltesDRD = !this.showTempltesDRD;
        }
        console.log('Scheme', this.selected);
    }

    getPicture() {
        this.isReady = !this.isReady;
    }

    showMurderface(scheme) {
        this.resetAllTemplates();
        this.isMurderface = true;
        this.className = scheme;
    }

    showSkwigelf(scheme) {
        this.resetAllTemplates();
        this.isSkwigelf = true;
        this.className = scheme;
    }

    showPickels(scheme) {
        this.resetAllTemplates();
        this.isPickels = true;
        this.className = scheme;
    }

    showDethklok(templateClass, footerText, scheme) {
        this.resetAllTemplates();
        this.isDethklok = true;
        this.templateClass = templateClass;
        this.footerText = footerText;
        this.className = scheme;
    }

    showExplosion(scheme) {
        this.resetAllTemplates();
        this.isExplosion = true;
        this.className = scheme;
    }

    resetAllTemplates() {
        this.isMurderface = false;
        this.isSkwigelf = false;
        this.isExplosion = false;
        this.isReady = false;
        this.isPickels = false;
        this.isDethklok = false;
    }

}

PicturesController.$inject = ['$log', '$rootScope', '$http'];

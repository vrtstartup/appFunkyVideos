//TODO: refactor show functions
export default class PicturesController {
    constructor(Upload) {

        this.Upload = Upload;

        this.className = 'drd';
        this.image = '';

        this.resetAllTemplates();
    }

    upload(file, type) {
        this.Upload.upload({
            url: '/api/convertimage/' + type,
            data: {file: file}
        }).then((resp) => {
            this.image = resp.data.url;
            console.log('Success ' + resp.config.data.file.name + ' uploaded. Response: ' + resp.data.url);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    }

    getScheme(scheme) {

        if(scheme === 'ak' ){
            this.showTempltesAK = !this.showTempltesAK;
        }
        if(scheme === 'drd' ){
            this.showTempltesDRD = !this.showTempltesDRD;
        }
        if(scheme === 'r1'){
            this.showTempltesR1 = !this.showTempltesR1;
        }
        if(scheme === 'canvas'){
            this.showTempltesCanvas = !this.showTempltesCanvas;
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

    showBob(scheme) {
        this.resetAllTemplates();
        this.isBob = true;
        this.className = scheme;
    }

    showTina(scheme) {
        this.resetAllTemplates();
        this.isTina = true;
        this.className = scheme;
    }

    showWartooth(scheme) {
        this.resetAllTemplates();
        this.isWartooth = true;
        this.className = scheme;
    }


    resetAllTemplates() {
        this.isMurderface = false;
        this.isSkwigelf = false;
        this.isExplosion = false;
        this.isReady = false;
        this.isPickels = false;
        this.isDethklok = false;
        this.isBob = false;
        this.isTina = false;
        this.isWartooth = false;
    }

}

PicturesController.$inject = ['Upload'];

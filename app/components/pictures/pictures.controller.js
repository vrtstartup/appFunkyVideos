export default class PicturesController {
    constructor(Upload, firebaseAuth, userManagement, videoGeneration) {

        this.Upload = Upload;
        this.videoGeneration = videoGeneration;

        this.className = 'drd';
        this.image = '';

        this.userManagement = userManagement;
        this.firebaseAuth = firebaseAuth;
        this.firebaseAuth.$onAuth((authData) => {
            if (authData) {
                this.userManagement.checkAccountStatus(authData.uid).then((obj, message, error) => {
                    this.userBrand = obj.brand;
                });
                this.userEmail = authData.password.email;
            }
        });

    }

    upload(file, type, numb) {
        this.Upload.upload({
            url: '/api/convertimage/' + type,
            data: { file: file }
        }).then((resp) => {
            if (numb) {
                this.quote[numb] = resp.data.url;
            }
            this.image = resp.data.url;
            console.log('Success ' + resp.config.data.file.name + ' uploaded. Response: ' + resp.data.url);
        }, function(resp) {
            console.log('Error status: ' + resp.status);
        }, function(evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    }

    getScheme(scheme) {

        if (scheme === 'ak') {
            this.showTempltesAK = !this.showTempltesAK;
        }
        if (scheme === 'drd') {
            this.showTempltesDRD = !this.showTempltesDRD;
        }
        if (scheme === 'r1') {
            this.showTempltesR1 = !this.showTempltesR1;
        }
        if (scheme === 'canvas') {
            this.showTempltesCanvas = !this.showTempltesCanvas;
        }
        console.log('Scheme', this.selected);
    }

    getPicture() {
        // takeScreenShot
        var element = angular.element(document.getElementsByClassName('dir-wrap'));
        this.videoGeneration
            .takeScreenshot(element, true)
            .then(templateUrl => {
                //$scope.template_url = templateUrl;
            });
    }

    // setTemplate('Murderface', 'drd);
    setTemplate(name, scheme, templateClass, footerText) {
        this.templateName = name;
        this.className = scheme;
        this.templateClass = templateClass;
        this.footerText = footerText;
    }

}

PicturesController.$inject = ['Upload', 'firebaseAuth', 'userManagement', 'videoGeneration'];

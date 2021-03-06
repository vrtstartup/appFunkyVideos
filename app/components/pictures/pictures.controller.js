export default class PicturesController {
    constructor(Upload, $firebaseAuth, userManagement, videoGeneration, $http) {

        this.Upload = Upload;
        this.videoGeneration = videoGeneration;

        this.className = 'drd';
        this.image = '';

        this.$http = $http;
        this.userManagement = userManagement;
        this.firebaseAuth = $firebaseAuth();
        this.firebaseAuth.$onAuthStateChanged((authData) => {
            if (authData) {
                this.userManagement.checkAccountStatus(authData.uid).then((obj, message, error) => {
                    this.userBrand = obj.brand;
                });
                this.userEmail = authData.email;
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
        }, function(resp) {
        }, function(evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
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
        if (scheme === 'r2') {
            this.showTempltesR2 = !this.showTempltesR2;
        }
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


    getBreaking() {
        this.$http.get('assets/templates/breaking.jpg', {
                responseType: "arraybuffer"
            })
            .success((data) => {
                var anchor = angular.element('<a/>');
                var blob = new Blob([data]);
                anchor.attr({
                    href: window.URL.createObjectURL(blob),
                    target: '_blank',
                    download: 'breaking.png'
                })[0].click();
            })
    }


    // setTemplate('Murderface', 'drd);
    setTemplate(name, scheme, templateClass, footerText) {
        this.templateName = name;
        this.className = scheme;
        this.templateClass = templateClass;
        this.footerText = footerText;
    }

}

PicturesController.$inject = ['Upload', '$firebaseAuth', 'userManagement', 'videoGeneration', '$http'];
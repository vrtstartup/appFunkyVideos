//TODO: refactor show functions
export default class MoviesController {
    constructor($scope, $http, $document, Upload, $mdDialog, toast, firebaseAuth) {
        this.$scope = $scope;
        this.$http = $http;
        this.$document = $document;
        this.Upload = Upload;
        this.toast = toast;
        this.$mdDialog = $mdDialog;

        this.movie = {};
        this.movieClips = [];
        this.currentClip = {};


        this.templatePath = '';

        this.number = 0;
        this.movie.id = Date.now();

        // TODO: add dynamic bumper & logo
        this.movie.bumper = 11;
        this.movie.logo = 11;

        this.firebaseAuth = firebaseAuth;
        this.firebaseAuth.$onAuth((authData) => {
            if (authData) {
                this.movie.email = authData.password.email;
            }
        });


        this.clipTemplates = [{
                'name': 'text',
                'description': 'Tekst op foto',
                'url': 'assets/stitcherTemplates/textSlide.png',
                'templaterPath': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\image_test_02.aep',
                'templateLocalPath': '/components/movies/movie.tekst.html'
            }, {
                'name': 'number',
                'description': 'Licht 1 nummer of woord uit.',
                'url': 'assets/stitcherTemplates/numberSlide.png',
                'templaterPath': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\image_test_02.aep',
                'templateLocalPath': '/components/movies/movie.number.html'
            }, {
                'name': 'quote',
                'description': 'Licht 1 nummer of woord uit.',
                'url': 'assets/stitcherTemplates/quoteSlide.png',
                'templaterPath': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\image_test_02.aep',
                'templateLocalPath': '/components/movies/movie.quote.html'
            }, {
                'name': 'icon',
                'description': 'Gebruik een icoon om iets uit te leggen.',
                'url': 'assets/stitcherTemplates/iconSlide.png',
                'templaterPath': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\image_test_02.aep',
                'templateLocalPath': '/components/movies/movie.icon.html'
            }, {
                'name': 'tweet',
                'description': 'Toon een tweet in beeld.',
                'url': 'assets/stitcherTemplates/tweetSlide.png',
                'templaterPath': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\image_test_02.aep',
                'templateLocalPath': '/components/movies/movie.tweet.html'
            }

        ];

        this.movieTypes = [{
            'name': 'tekst',
            'templateName': 'template_02_tekst',
            'templateLocalPath': '/components/movies/movie.tekst.html',
            'templaterPath': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\image_test_02.aep',
            'thumb': '/assets/movies-title.png'
        }];

        // this.showDialog();
    }




    initiateClip(template) {
        console.log('creating a new clip with template url: ', template);
        var clip = {
            'id': this.number,
            'movieId': this.movie.id,
            'bot': 'render',
            'render-status': 'ready',
            'uploaded': false,
            'saved': false,
            'aep': template
        };


        this.movieClips.push(clip);
        this.$mdDialog.hide();

    }

    /* start navigation */
    changeLayout(type) {
        var property = type.name.replace('-', '');

        if (this.currentClip[property]) {
            delete this.currentClip[property];
        }

        this.templatePath = type;
    }

    showDialog() {
        this.$mdDialog.show({
            templateUrl: '/components/movies/movie.dialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            escapeToClose: false,
            scope: this.$scope,
            preserveScope: true
        });
    }

    resetDialog() {
            this.$mdDialog.hide();
            //reset tabindex to upload form, if reset is called we assume e-mail is valid so skip index 0.
            this.tabIndex = 1;
        }
        /*  end of navigation */

    initMovie() {
        this.initNewClip();

        this.tabIndex++;
    }

    initNewClip() {
        this.progressPercentage = 0;
        this.number = this.number + 1;

        this.currentClip = {
            'id': this.number,
            'movieId': this.movie.id,
            'bot': 'render',
            'render-status': 'ready',
            'uploaded': false,
            'saved': false
        };
    }

    selectFile() {
        angular.element(this.$document[0].querySelector('#clipFile'))[0].click();
    }

    // upload images to dropbox
    uploadFile(file) {
        this.Upload.upload({
                url: 'api/movie/upload-to-dropbox',
                data: { 'movieId': this.movie.id, 'clipId': this.currentClip.id, file: file },
                method: 'POST'
            })
            .then((resp) => {
                console.log("RESPONSE", resp.data);
                this.currentClip.img01 = resp.data.filenameIn;
                this.currentClip.uploaded = true;
                this.tabIndex++;
                console.log('image uploaded', this.currentClip);
            }, (resp) => {
                console.log('Error: ' + resp.error);
                console.log('Error status: ' + resp.status);
            }, (evt) => {
                this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
    }

    addClip() {
        if (!this.currentClip.saved) {
            this.saveClip();
        }

        this.showDialog();
        this.initNewClip();
    }

    saveClip() {
        if (this.currentClip.saved) {
            return;
        }

        if (this.movieClips.length) {
            this.movieClips[this.movieClips.length - 1].img02 = this.currentClip.img01;
            console.log('setting img02 of previous clip', this.movieClips);
        }

        this.currentClip.output = this.movie.id + '/' + this.number;
        this.currentClip.last = false;
        this.currentClip.type = this.templatePath.name;
        this.currentClip.saved = true;

        this.movieClips.push(this.currentClip);
    }

    deleteClip(clip) {
        this.movieClips = reject(this.movieClips, (movieClip) => {
            return movieClip.id === clip.id;
        });
    }

    renderMovie() {
        // go through all clips and set attributes on the last one
        let counter = 1;
        angular.forEach(this.movieClips, (clip) => {
            if (counter >= this.movieClips.length) {
                clip.last = true;
                clip.email = this.movie.email;
                clip.bumper = this.movie.bumper;
                clip.logo = this.movie.logo;
            }
            counter++;
        });

        let params = {
            movieClips: this.movieClips
        };

        this.$http.post('api/movie/update-movie-json', params)
            .then(() => {
                this.toast.showToast('success', 'Uw video wordt zodra verwerkt, het resultaat wordt naar u doorgemailed.');
            });
    }
}

MoviesController.$inject = ['$scope', '$http', '$document', 'Upload', '$mdDialog', 'toast', 'firebaseAuth'];

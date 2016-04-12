//TODO: refactor show functions
export default class MoviesController {
    constructor($scope, $rootScope, $http, $document, Upload, $firebaseArray, $firebaseObject, $mdDialog, toastService) {
        this.$scope = $scope;
        this.$http = $http;
        this.$document = $document;
        this.Upload = Upload;
        this.$mdDialog = $mdDialog;
        this.$firebaseArray = $firebaseArray;
        this.$firebaseObject = $firebaseObject;
        this.firebaseMovies = this.$firebaseArray(new Firebase('vrtnieuwshub.firebaseio.com/apps/movies/movies'));
        this.firebaseMovieClips = this.$firebaseArray(new Firebase('vrtnieuwshub.firebaseio.com/apps/movies/movieclips'));

        this.movie = {};
        this.movieClips = [];
        this.currentClip = {};
        this.emailValid = false;
        this.progressPercentage = 0;
        this.tabIndex = 0;
        this.templatePath = '';

        this.movieTypes = [
            {
                'name': 'title',
                'templateName': 'template_02_title',
                'templateLocalPath': '/components/movies/movie.title.html',
                'templaterPath': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\template_02_title.aep',
                'thumb': '/assets/movies-title.png'
            },
            {
                'name': 'text-left',
                'templateName': 'template_02_text_left',
                'templateLocalPath': '/components/movies/movie.textleft.html',
                'templaterPath': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\template_02_text_left.aep',
                'thumb': '/assets/movies-title.png'
            },
            {
                'name': 'text-right',
                'templateName': 'template_02_text_right',
                'templateLocalPath': '/components/movies/movie.textright.html',
                'templaterPath': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\template_02_text_right.aep',
                'thumb': '/assets/movies-title.png'
            },
            {
                'name': 'quote',
                'templateName': 'template_02_quote',
                'templateLocalPath': '/components/movies/movie.quote.html',
                'templaterPath': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\template_02_quote.aep',
                'thumb': '/assets/movies-title.png'
            },
            {
                'name': 'number',
                'templateName': 'template_02_number',
                'templateLocalPath': '/components/movies/movie.number.html',
                'templaterPath': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\template_02_number.aep',
                'thumb': '/assets/movies-title.png'
            },
            {
                'name': 'bullet-list',
                'templateName': 'template_02_bullet_list',
                'templateLocalPath': '/components/movies/movie.bulletlist.html',
                'templaterPath': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\template_02_bullet_list.aep',
                'thumb': '/assets/movies-title.png'
            }
        ];

        this.showDialog();

        //watch layout type, delete old property if type changes in edit mode
        this.$scope.$watch('vm.templatePath', (newVal, oldVal) => {
            if (newVal === oldVal) {
                return;
            }

            if (oldVal.name) {
                var property = oldVal.name.replace('-', '');
            }

            if (this.currentClip[property]) {
                delete this.currentClip[property];
            }
        });
    }

    changeLayout(type) {
        var property = type.name.replace('-', '');

        if (this.currentClip[property]) {
            delete this.currentClip[property];
        }

        this.templatePath = type;
    }

    showDialog() {
        this.$mdDialog.show({
            templateUrl: '/components/movies/movie.tabs.html',
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

    initMovie() {
        this.emailValid = true;

        //#todo save email adres to firebase, use movieID returned by firebase to identify movie
        this.firebaseMovies.$add({'email': this.movie.email})
            .then((ref) => {
                this.movie = this.$firebaseObject(ref);
                this.initNewClip(ref.key());
            });

        this.tabIndex++;
    }

    initNewClip(movieId) {
        this.progressPercentage = 0;

        this.currentClip = {
            'id': this.generateClipId(),
            'movieId': movieId,
            'bot': 'render',
            'render-status': 'ready',
            'aep': 'filepath',
            'last': '',
            'uploaded': false,
            'saved': false
        };
    }

    selectFile() {
        angular.element(this.$document[0].querySelector('#clipFile'))[0].click();
    }

    uploadFile(file) {
        this.Upload.mediaDuration(file)
            .then((durationInSeconds) => {
                this.currentClip.start = this.movieClips[this.movieClips.length-1] ? this.movieClips[this.movieClips.length -1].end || 0 : 0;
                this.currentClip.end = this.currentClip.start + durationInSeconds;
            });

        this.Upload.upload({
            url: 'api/movie/movie-clip',
            data: {'movieId': this.movie.$id, 'clipId': this.currentClip.id, file: file},
            method: 'POST'
        })
        .then((resp) => {
            this.currentClip.path = resp.data.filePath;
            this.currentClip.uploaded = true;
            this.tabIndex++;
        }, (resp) => {
            console.log('Error: ' + resp.error);
            console.log('Error status: ' + resp.status);
        }, (evt) => {
            this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        });
    }

    addClip() {
        if(!this.currentClip.saved) {
            this.saveClip();
        }

        this.showDialog();
        this.initNewClip(this.movie.$id);
    }

    saveClip() {
        if(this.currentClip.saved) {
            return;
        }

        this.currentClip.output = this.movie.$id + '/' + this.currentClip.id
        this.currentClip.aep = this.templatePath.templaterPath;
        this.currentClip.type = this.templatePath.name;
        this.currentClip.saved = true;
        this.movieClips.push(this.currentClip);
    }

    deleteClip(clip) {
        this.movieClips = reject(this.movieClips, (movieClip) => {
            return movieClip.id === clip.id;
        });
    }

    generateClipId() {
        return Math.random().toString(16).slice(2);
    }

    renderMovie() {
        var counter = 1;
        angular.forEach(this.movieClips, (clip) => {
            if (this.movieClips.length >= counter) {
                clip.last = true;
            }

            this.firebaseMovieClips.$add(clip);
            counter++;
        });

        this.movie.$save()
            .then(() => {
                console.log('saved');
            });

        var params = {
            movieClips: this.movieClips
        };

        this.$http.post('api/movies/update-movie-json', params)
            .then((response) => {
                this.toast.showToast('success', 'Uw video wordt zodra verwerkt, het resultaat wordt naar u doorgemailed.');
            });
    }
}

MoviesController.$inject = ['$scope', '$rootScope', '$http', '$document', 'Upload', '$firebaseArray', '$firebaseObject', '$mdDialog'];

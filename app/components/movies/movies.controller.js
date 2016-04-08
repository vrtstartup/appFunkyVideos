//TODO: refactor show functions
export default class MoviesController {
    constructor($rootScope, $http, $document, Upload) {
        this.$document = $document;
        this.Upload = Upload;

        this.currentClip = {};

        this.movie = {};
        this.movieClips = [];
        this.emailValid = true;
        this.progressPercentage = 0;

        this.movieTypes = [
            {
                'name': 'title',
                'templateName': 'template_02_title',
                'templateLocalPath': '/components/movies/movie.title.html'
            },
            {
                'name': 'text-left',
                'templateName': 'template_02_text_left',
                'templateLocalPath': '/components/movies/movie.textleft.html'
            },
            {
                'name': 'text-right',
                'templateName': 'template_02_text_right',
                'templateLocalPath': '/components/movies/movie.textright.html'
            },
            {
                'name': 'quote',
                'templateName': 'template_02_quote',
                'templateLocalPath': '/components/movies/movie.quote.html'
            },
            {
                'name': 'number',
                'templateName': 'template_02_number',
                'templateLocalPath': '/components/movies/movie.number.html'
            },
            {
                'name': 'bullet-list',
                'templateName': 'template_02_bullet_list',
                'templateLocalPath': '/components/movies/movie.bulletlist.html'
            },
        ];

        this.initMovie();
    }

    initMovie() {
        this.emailValid = true;

        //#todo get movie ID, and assign it to clip
        this.movie.id = 123;
        this.initNewClip(this.movie.id);
    }

    initNewClip(movieId) {
        this.currentClip = {
            'id': this.generateClipId(),
            'movieId': movieId,
            'bot': 'render',
            'render-status': 'ready',
            'aep': 'filepath',
            'last': '',
        }
    }

    selectFile() {
        angular.element(this.$document[0].querySelector('#clipFile'))[0].click();
    }

    uploadFile(file) {
        this.Upload.upload({
            url: 'api/movie/movie-clip',
            data: {'movieId': this.movie.id, 'clipId': this.currentClip.id, file: file},
            method: 'POST'
        })
        .then((resp) => {
            console.log(resp);
        }, (resp) => {
            console.log('Error: ' + resp.error);
            console.log('Error status: ' + resp.status);
        }, (evt) => {
            this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        });
    }

    addClip() {
        this.movieClips.push(this.currentClip);
        this.initNewClip(this.movie.id);
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
        console.log('movie', this.movie);
        console.log('movieClips', this.movieClips);
        //set 'last' to true for last clip in movieClips
        //show confirm dialog
        //get options and set them

        //send all clips to firebase
        //https://vrtnieuwshub.firebaseio.com/apps/movies/movieclips

        //send movie to firebase
        //https://vrtnieuwshub.firebaseio.com/apps/movies/movies
    }
}

MoviesController.$inject = ['$rootScope', '$http', '$document', 'Upload'];

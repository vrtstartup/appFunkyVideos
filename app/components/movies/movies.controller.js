//TODO: refactor show functions
export default class PicturesController {
    constructor($rootScope, $http) {

        this.currentClip = {};

        this.movie = {};
        this.movieClips = [];
        this.emailValid = true;

        this.movieTypes = [
            {
                'name': 'title',
                'templateName': 'template_02_title'
            },
            {
                'name': 'text-left',
                'templateName': 'template_02_text_left'
            },
            {
                'name': 'text-right',
                'templateName': 'template_02_text_right'
            },
            {
                'name': 'quote',
                'templateName': 'template_02_quote'
            },
            {
                'name': 'number',
                'templateName': 'template_02_number'
            },
            {
                'name': 'bullet-list',
                'templateName': 'template_02_bullet_list'
            },
        ];

        initNewClip();
    }

    initMovie() {
        this.emailValid = true;

        //#todo get movie ID, assign it to every clip
    }

    initNewClip() {
        this.currentClip = {
            'id': this.generateClipId(),
            'bot': "render",
            'render-status': "ready",
            'aep': 'filepath',
            'movieId': '',
            'last': ''
        }
    }

    addClip() {
        console.log('currentClip', this.currentClip);
        this.currentClip.id = generateClipId();
        this.movieClips.push(this.currentClip);
        this.initNewClip();
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
        //set 'last' to true for last clip in movieClips

        //send all clips to firebase

        //send movie to firebase
    }
}

PicturesController.$inject = ['$rootScope', '$http'];

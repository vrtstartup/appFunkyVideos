import { filter } from 'lodash';

export default class HomeController {
    constructor($log, $http, $scope, $timeout) {
        this.$log = $log;
        this.$http = $http;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.currentFilter = '';


        /*
            EXAMPLE complete obj:
            {
                'title': 'Pagemaker',
                'sub': 'Maak een mooi, langer verhaal',
                'status': 'Stuur een mailtje naar maarten.lauwaert@vrt.be indien je deze tool wil uittesten.',
                'type': 'tool',
                'image': 'assets/home-pagemaker.png',
                'url': 'http://vrtstartup.github.io/vrtpagemaker', //URL to actual app - remove if only a guide
                'docUrl': 'https://app.frontify.com/d/1vi0ktgfFCVU/de-communicatiegids' //URL to app manual or manual,
                'disabled': true
            },
         */
        this.tiles = [
            {
                'title': 'Grid',
                'sub': 'Overzicht van posted content',
                'type': 'tool',
                'category': 'facebook',
                'image': 'assets/home-grid.png',
                'url': '/#/grid'
            },
            {
                'title': 'Afbeeldingmaker',
                'sub': 'Maak snel afbeeldingen met voorgemaakte sjablonen',
                'status': 'Klaar om te gebruiken, maar verwacht je aan een foutje hier en daar.',
                'type': 'tool',
                'category': 'facebook',
                'image': 'assets/home-pictures.png',
                'url': '/#/pictures',
                'docUrl': 'https://app.frontify.com/d/1vi0ktgfFCVU/tools-templates#/foto-templates/headline'
            },
            {
                'title': 'Ondertitels',
                'sub': 'Voeg ondertitels toe aan een filmpje',
                'type': 'tool',
                'category': 'facebook',
                'image': 'assets/home-subtitler.png',
                'url': '/#/subtitles',
                'docUrl': 'https://app.frontify.com/d/1vi0ktgfFCVU/tools-templates#/ondertitel-tool/ondertitels-toevoegen'
            },
            {
                'title': 'Infografieken',
                'sub': 'Maak bewegende infografieken',
                'status': 'Voorlopig werkt slechts 1 template: het taartdiagram.',
                'type': 'tool',
                'image': 'assets/home-charts.png',
                'url': '/#/chart',
                'docUrl': 'https://app.frontify.com/d/1vi0ktgfFCVU/tools-templates#/video-templates/taartgrafiek'
            },
            {
                'title': 'Pagemaker',
                'sub': 'Maak een mooi, langer verhaal',
                'status': 'Stuur een mailtje naar maarten.lauwaert@vrt.be indien je deze tool wil uittesten.',
                'type': 'tool',
                'image': 'assets/home-pagemaker.png',
                'url': 'http://vrtstartup.github.io/vrtpagemaker',
                'docUrl': 'https://app.frontify.com/d/TxcwgYOVtrNH/vrt-pagemaker-handleiding#/de-basis/basis-in-7-regels'
            },
            {
                'title': 'Dashboard',
                'sub': 'Evalueer hoe je posts het gedaan hebben',
                'type': 'tool',
                'url': 'https://app.klipfolio.com/dashboard'
            },
            {
                'title': 'Maps',
                'sub': 'Genereer een map met marker',
                'status': 'In ontwikkeling',
                'type': 'tool',
                'category': 'facebook',
                'image': 'assets/home-maps.png',
                'url': '/#/maps',
                'disabled': true
            },
            {
                'title': 'Video met tekst',
                'sub': 'Voeg korte tekstje toe met uitleg aan een filmpje',
                'type': 'tool',
                'image': 'assets/home-templater.png',
                'url': 'https://vrtnieuwshub.firebaseapp.com/#/',
                'disabled': true
            },
            {
                'title': '7 Facebookregels',
                'sub': 'De 7 gouden Facebook regels',
                'type': 'guide',
                'image': 'assets/home-facebook.png',
                'docUrl': 'https://app.frontify.com/d/1vi0ktgfFCVU/7-gouden-regels'
            },
            {
                'title': 'Communicatiegids Facebook',
                'sub': 'Hoe werk je met Facebook?',
                'type': 'guide',
                'image': 'assets/home-facebook.png',
                'docUrl': 'https://app.frontify.com/d/1vi0ktgfFCVU/communicatiegids'
            },
            {
                'title': 'Handleiding Tools & Templates',
                'category': 'facebook',
                'type': 'guide',
                'image': 'assets/home-facebook.png',
                'docUrl': 'https://app.frontify.com/d/1vi0ktgfFCVU/tools-templates'
            },
            {
                'title': '10 Gebruikersinzichten',
                'category': 'facebook',
                'type': 'guide',
                'image': 'assets/home-facebook.png',
                'docUrl': 'https://app.frontify.com/d/1vi0ktgfFCVU/inzichten'
            },
            {
                'title': '3 subdoelgroepen VRT Nieuws',
                'category': 'facebook',
                'type': 'guide',
                'image': 'assets/home-userinsights.png',
                'docUrl': 'https://app.frontify.com/d/1vi0ktgfFCVU/inzichten'
            },
            {
                'title': 'Tips & Tricks Twitter',
                'category': 'twitter',
                'type': 'guide',
                'image': 'assets/home-twitter.png',
                'docUrl': 'https://app.frontify.com/d/9kNTzmw2XVAO/vrt-nieuws-op-twitter'
            },
            {
                'title': 'Learnings test',
                'category': 'facebook',
                'type': 'learnings',
                'docUrl': ''
            }
        ];

        this.filteredTiles = this.tiles;
    }

    filterTiles(_filter) {
        if(_filter === this.currentFilter) {
            this.currentFilter = '';
            this.filteredTiles = this.tiles;
            return;
        }

        this.currentFilter = _filter;

        this.filteredTiles = filter(this.tiles, (tile) => {
            return tile.type === this.currentFilter;
        });
    }

}

HomeController.$inject = ['$log', '$http', '$scope', '$timeout'];

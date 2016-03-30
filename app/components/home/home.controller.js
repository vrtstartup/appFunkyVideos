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
                'docUrl': 'https://app.frontify.com/d/1vi0ktgfFCVU/de-communicatiegids' //URL to app manual or manual
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
                'docUrl': 'https://app.frontify.com/document/80390#/foto-tools/headline'
            },
            {
                'title': 'Ondertitels',
                'sub': 'Voeg ondertitels toe aan een filmpje',
                'status': 'klaar om te gebruiken, maar verwacht je aan een foutje hier en daar.',
                'type': 'tool',
                'category': 'facebook',
                'image': 'assets/home-subtitler.png',
                'url': '/#/subtitles',
                'docUrl': 'https://app.frontify.com/document/80390#/ondertiteling/ondertitels-toevoegen'
            },
            {
                'title': 'Maps',
                'sub': 'Genereer een map met marker',
                'status': 'In ontwikkeling',
                'type': 'tool',
                'category': 'facebook',
                'image': 'assets/home-maps.png',
                'url': '/#/maps'
            },
            {
                'title': 'Explainers',
                'sub': 'Voeg korte tekstje toe met uitleg aan een filmpje',
                'type': 'tool',
                'image': 'assets/home-templater.png',
                'url': 'https://vrtnieuwshub.firebaseapp.com/#/'
            },
            {
                'title': 'Pagemaker',
                'sub': 'Maak een mooi, langer verhaal',
                'status': 'Stuur een mailtje naar maarten.lauwaert@vrt.be indien je deze tool wil uittesten.',
                'type': 'tool',
                'image': 'assets/home-pagemaker.png',
                'url': 'http://vrtstartup.github.io/vrtpagemaker',
                'docUrl': 'https://app.frontify.com/d/1vi0ktgfFCVU/de-communicatiegids'
            },
            {
                'title': 'Infografieken',
                'sub': 'Maak bewegende infografieken',
                'status': 'Voorlopig werkt slechts 1 template: het taartdiagram.',
                'type': 'tool',
                'image': 'assets/home-charts.png',
                'url': '/#/chart',
                'docUrl': 'https://app.frontify.com/document/80390#/video-tool/taartgrafiek'
            },
            {
                'title': 'Facebook Algemeen',
                'sub': 'Hoe werk je met Facebook?',
                'type': 'guide',
                'image': 'assets/home-facebook.png',
                'docUrl': 'https://app.frontify.com/d/1vi0ktgfFCVU/de-communicatiegids'
            },
            {
                'title': 'Schrijven voor Facebook',
                'sub': 'Hoe schrijf je best je posts op Facebook?',
                'type': 'guide',
                'image': 'assets/home-facebook.png',
                'docUrl': 'https://app.frontify.com/d/1DSJVfQzMjiF/facebook-tekst-en-stijlgids-style-guide'
            },
            {
                'title': 'Handleiding pagemaker',
                'sub': 'Uitgebreide handleiding om met de Pagemaker aan de slag te gaan',
                'type': 'guide',
                'image': 'assets/home-pagemakerGuide.png',
                'docUrl': 'https://app.frontify.com/d/TxcwgYOVtrNH/vrt-pagemaker-handleiding'
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

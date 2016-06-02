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
                'title': 'Social Grid',
                'sub': 'Maak een dagoverzicht van de Facebookmix',
                'type': 'tool',
                'category': 'facebook',
                'image': 'assets/home-grid.png',
                'url': '/#/grid'
            },
            {
                'title': 'Afbeeldingmaker',
                'sub': 'Maak social templates in enkele klikken',
                'status': 'Klaar om te gebruiken, maar verwacht je aan een foutje hier en daar.',
                'type': 'tool',
                'category': 'facebook',
                'image': 'assets/home-pictures.png',
                'url': '/#/pictures',
                'docUrl': 'https://app.frontify.com/d/1vi0ktgfFCVU/tools-templates#/foto-templates/headline'
            },
            {
                'title': 'Ondertitels',
                'sub': 'Voeg subtitles toe aan filmpjes',
                'type': 'tool',
                'category': 'facebook',
                'image': 'assets/home-subtitler.png',
                'url': '/#/subtitles',
                'docUrl': 'https://app.frontify.com/d/1vi0ktgfFCVU/tools-templates#/ondertitel-tool/ondertitels-toevoegen'
            },
            {
                'title': 'Infotainment',
                'sub': 'Maak bewegende infografieken',
                'status': 'Voorlopig werkt slechts 1 template: het taartdiagram.',
                'type': 'tool',
                'image': 'assets/home-charts.png',
                'url': '/#/chart',
                'docUrl': 'https://app.frontify.com/d/1vi0ktgfFCVU/tools-templates#/video-templates/taartgrafiek'
            },
            {
                'title': 'Lang verhaal',
                'sub': 'Creëer long copy met Pagemaker',
                'status': 'Stuur een mailtje naar maarten.lauwaert@vrt.be indien je deze tool wil uittesten.',
                'type': 'tool',
                'image': 'assets/home-pagemaker.png',
                'url': 'http://vrtstartup.github.io/vrtpagemaker',
                'docUrl': 'https://app.frontify.com/d/TxcwgYOVtrNH/vrt-pagemaker-handleiding#/de-basis/basis-in-7-regels'
            },
            {
                'title': 'Video Downloader',
                'sub': 'Download video\'s vanuit Facebook en andre bronen',
                'status': 'Stuur een mailtje naar maarten.lauwaert@vrt.be indien je deze tool wil uittesten.',
                'type': 'tool',
                'image': 'assets/home-download-video.png',
                'url': '/#/download',
            },
            {
                'title': 'Social Dashboard',
                'sub': 'Evalueer bereik en interactie van Facebookposts',
                'type': 'tool',
                'url': 'https://app.klipfolio.com/dashboard'
            },
            {
                'title': 'Kaarten',
                'sub': 'Genereer maps met Marker',
                'status': 'In ontwikkeling',
                'type': 'tool',
                'category': 'facebook',
                'image': 'assets/home-maps.png',
                'url': '/#/maps',

            },
            {
                'title': 'Video met tekst',
                'sub': 'Voeg extra uitleg toe aan filmpjes',
                'type': 'tool',
                'image': 'assets/home-templater.png',
                'url': 'https://vrtnieuwshub.firebaseapp.com/#/',
                'disabled': true
            },
            {
                'title': '7 Gouden Regels',
                'sub': 'VRT Nieuws op Facebook',
                'type': 'guide',
                'image': 'assets/home-facebook.png',
                'docUrl': 'https://app.frontify.com/d/1vi0ktgfFCVU/7-gouden-regels'
            },
            {
                'title': 'Communicatiegids',
                'sub': 'Taal- & beeldgebruik op Facebook',
                'type': 'guide',
                'image': 'assets/home-facebook.png',
                'docUrl': 'https://app.frontify.com/d/1vi0ktgfFCVU/communicatiegids'
            },
            {
                'title': 'Tools & Templates gids',
                'sub': 'Handleiding met stappenplannen',
                'category': 'facebook',
                'type': 'guide',
                'image': 'assets/home-facebook.png',
                'docUrl': 'https://app.frontify.com/d/1vi0ktgfFCVU/tools-templates'
            },
            {
                'title': 'Tips & Tricks',
                'sub': 'VRT Nieuws op Twitter',
                'category': 'twitter',
                'type': 'guide',
                'image': 'assets/home-twitter.png',
                'docUrl': 'https://app.frontify.com/d/9kNTzmw2XVAO/vrt-nieuws-op-twitter'
            },
            {
                'title': '10 Gebruikersinzichten',
                'sub': 'Inzichten gebruikersonderzoek VRT Nieuws',
                'category': 'facebook',
                'type': 'learnings',
                'image': 'assets/home-facebook.png',
                'docUrl': 'https://app.frontify.com/d/1vi0ktgfFCVU/inzichten'
            },
            {
                'title': '3 Subdoelgroepen',
                'sub': 'Ontdek de VRT Nieuws persona',
                'category': 'facebook',
                'type': 'learnings',
                'image': 'assets/home-userinsights.png',
                'docUrl': 'https://app.frontify.com/d/1vi0ktgfFCVU/inzichten'
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

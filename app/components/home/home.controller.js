export default class HomeController {
    constructor($log, $http, $scope, $timeout) {
        this.$log = $log;
        this.$http = $http;
        this.$scope = $scope;
        this.$timeout = $timeout;

        this.tiles = [
            {
                'title': 'Afbeeldingmaker',
                'sub': 'Maak snel afbeeldingen met voorgemaakte sjablonen',
                'status': 'Klaar om te gebruiken, maar verwacht je aan een foutje hier en daar.',
                'type': 'tool',
                'category': 'facebook',
                'image': 'assets/home-pictures.png',
                'url': '/#/pictures'
            },
            {
                'title': 'Ondertitels',
                'sub': 'Voeg ondertitels toe aan een filmpje',
                'status': 'klaar om te gebruiken, maar verwacht je aan een foutje hier en daar.',
                'type': 'tool',
                'category': 'facebook',
                'image': 'assets/home-subtitler.png',
                'url': '/#/subtitles'
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
                'url': 'http://vrtstartup.github.io/vrtpagemaker'

            },
            {
                'title': 'Infografieken',
                'sub': 'Maak bewegende infografieken',
                'status': 'Voorlopig werkt slechts 1 template: het taartdiagram.',
                'type': 'tool',
                'image': 'assets/home-charts.png',
                'url': '/#/chart'
            },
            {
                'title': 'Facebook Algemeen',
                'sub': 'Hoe werk je met Facebook?',
                'type': 'guide',
                'image': 'assets/home-facebook.png',
                'url': 'https://app.frontify.com/d/1vi0ktgfFCVU/de-communicatiegids'
            },
            {
                'title': 'Schrijven voor Facebook',
                'sub': 'Hoe schrijf je best je posts op Facebook?',
                'type': 'guide',
                'image': 'assets/home-facebook.png',
                'url': 'https://app.frontify.com/d/1DSJVfQzMjiF/facebook-tekst-en-stijlgids-style-guide'
            },
            {
                'title': 'Handleiding pagemaker',
                'sub': 'Uitgebreide handleiding om met de Pagemaker aan de slag te gaan',
                'type': 'guide',
                'image': 'assets/home-pagemakerGuide.png',
                'url': 'https://app.frontify.com/d/TxcwgYOVtrNH/vrt-pagemaker-handleiding'
            }
        ];

        this.filteredTiles = this.tiles;
    }
}

HomeController.$inject = ['$log', '$http', '$scope', '$timeout'];

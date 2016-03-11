export default class HomeController {
    constructor($log, $http, $scope, $timeout) {
        this.$log = $log;
        this.$http = $http;
        this.$scope = $scope;
        this.$timeout = $timeout;


        this.tools = [

   {
                'image': 'assets/home-pictures.png',
                'url': 'http://cryptic-everglades-93518.herokuapp.com/#/pictures',
                'title': 'Afbeeldingmaker',
                'sub': 'Maak snel afbeeldingen met voorgemaakte sjablonen'
            },

            {
                'image': 'assets/home-subtitler.png',
                'url': 'http://cryptic-everglades-93518.herokuapp.com/#/subtitles',
                'title': 'Ondertitels',
                'sub': 'Voeg ondertitels toe aan een filmpje'
            },
            // {
            //     'image': 'assets/home-templater.png',
            //     'url': 'https://vrtnieuwshub.firebaseapp.com/#/',
            //     'title': 'Explainers',
            //     'sub' : 'Voeg korte tekstje toe met uitleg aan een filmpje'
            // },
            {
                'image': 'assets/home-pagemaker.png',
                'url': 'http://vrtstartup.github.io/vrtpagemaker',
                'title': 'Pagemaker',
                'sub': 'Maak een mooi, langer verhaal'
            }, {
                'image': 'assets/home-charts.png',
                'url': 'http://cryptic-everglades-93518.herokuapp.com/#/chart',
                'title': 'Infografieken',
                'sub': 'Maak bewegende infografieken'
            },

        ];


        this.guides = [{
            'image': 'assets/home-facebook.png',
            'url': 'https://app.frontify.com/document/79395',
            'title': 'Facebook Algemeen',
            'sub': 'Hoe werk je met Facebook?'
        }, {
            'image': 'assets/home-facebook.png',
            'url': 'https://app.frontify.com/d/1DSJVfQzMjiF/facebook-tekst-en-stijlgids-style-guide',
            'title': 'Schrijven voor Facebook',
            'sub': 'Hoe schrijf je best je posts op Facebook?'
        }, {
            'image': 'assets/home-pagemakerGuide.png',
            'url': 'https://app.frontify.com/d/TxcwgYOVtrNH/vrt-pagemaker-handleiding',
            'title': 'Handleiding pagemaker',
            'sub': 'Uitgebreide handleiding om met de Pagemaker aan de slag te gaan'
        }];



    }

    goTo(url) {
        window.location.href = url;
    }

}

HomeController.$inject = ['$log', '$http', '$scope', '$timeout'];

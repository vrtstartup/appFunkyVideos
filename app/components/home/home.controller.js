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
                'sub': 'Maak snel afbeeldingen met voorgemaakte sjablonen',
                'status': 'Klaar om te gebruiken, maar verwacht je aan een foutje hier en daar.'
            },

            // {
            //     'image': 'assets/home-subtitler.png',
            //     'url': 'http://cryptic-everglades-93518.herokuapp.com/#/subtitles',
            //     'title': 'Ondertitels',
            //     'sub': 'Voeg ondertitels toe aan een filmpje',
            //     'status': 'klaar om te gebruiken, maar verwacht je aan een foutje hier en daar.'
            // },
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
                'sub': 'Maak een mooi, langer verhaal',
                'status': 'Stuur een mailtje naar maarten.lauwaert@vrt.be indien je deze tool wil uittesten.'

            },
            //  {
            //     'image': 'assets/home-charts.png',
            //     'url': 'http://cryptic-everglades-93518.herokuapp.com/#/chart',
            //     'title': 'Infografieken',
            //     'sub': 'Maak bewegende infografieken',
            //     'status': 'Voorlopig werkt slechts 1 template: het taartdiagram.'

            // },

        ];


        this.guides = [{
            'image': 'assets/home-facebook.png',
            'url': 'https://app.frontify.com/d/1vi0ktgfFCVU/de-communicatiegids',
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

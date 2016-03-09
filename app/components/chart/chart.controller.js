export default class ChartController {
    constructor($log, $http, $scope, $timeout) {
        this.$log = $log;
        this.$http = $http;
        this.isHidden = false;
        this.isAnimated = false;
        this.isAnimatedPiechart = false;
        this.isAnimatedText = false;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.url = '';

        this.question = '';
        this.firstTitle = '';
        this.secondTitle = '';
        this.fValue = '';
        this.sValue = '';
        this.data = [];

    }

    startAnimation() {
        this.isAnimated = !this.isAnimated;

        this.$timeout(()=>{
            console.log(this.isAnimated);
            this.isAnimatedText = !this.isAnimatedText;

            this.animatePieChart();
        }, 4000);
    }

    animatePieChart() {
        //this.isAnimatedText = !this.isAnimatedText;
        this.isAnimatedPiechart = !this.isAnimatedPiechart;

        let fValue = parseInt(this.$scope.bar.percOne);
        let sValue = parseInt(this.$scope.bar.percTwo);
        let sum = fValue + sValue;
        let difference = 0;

        this.firstTitle = this.$scope.bar.titleOne;
        this.secondTitle = this.$scope.bar.titleTwo;

        if (sum < 100) {
            difference = 100 - sum;
        }

        this.data = [
            {"nb":"1", "title": this.firstTitle, "data": fValue},
            {"nb":"2", "title": this.secondTitle, "data": sValue},
            {"nb":"3", "title": this.$scope.bar.titleTwo, "data": difference},
        ];

        this.question = this.$scope.bar.question;
        this.fValue = fValue;
        this.sValue = sValue;
    }

    //fadeIt() {
    //    this.isHidden = !this.isHidden;
    //}

    getVideo() {
        this.$http({
            method: 'GET',
            url: '/api/images'
        }).then( (res) => {
            this.url = res.data.video_url;
            return this.url;
        }, (err) => {
            console.error('Error', err);
        });
    }

}

ChartController.$inject = ['$log', '$http', '$scope', '$timeout'];

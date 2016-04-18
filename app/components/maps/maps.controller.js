export default class Controller {
    constructor($scope, $document, $compile) {
        this.$scope = $scope;
        this.isReady = false;
        this.$document = $document;
        this.$compile = $compile;

        this.place = 'Belgium';

    }

    getPicture() {
        this.isReady = !this.isReady;
    }

    addLabel(title, type) {
        let el = angular.element('<div class="map-label-'+type+'" vrt-draggable draggable="true">'+title+'</div>');
        let target = this.$document[0].querySelector('#map-img');

        angular.element(target).append(this.$compile(el)(this.$scope));
        this.addPoint(type);
    }

    addPoint(type) {
        console.log('point');
        let el = angular.element('<div class="map-point-'+type+'" vrt-draggable draggable="true"></div>');
        let target = this.$document[0].querySelector('#map-img');

        angular.element(target).append(this.$compile(el)(this.$scope));
    }
}

Controller.$inject = ['$scope', '$document', '$compile'];
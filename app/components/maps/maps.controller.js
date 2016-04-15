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

    addLabel(title) {
        let el = angular.element('<div class="map-label" vrt-draggable draggable="true">'+title+'</div>');
        let target = this.$document[0].querySelector('#map-img');

        angular.element(target).append(this.$compile(el)(this.$scope));
    }
}

Controller.$inject = ['$scope', '$document', '$compile'];
export default class Controller {
    constructor($scope, $document, $compile) {
        this.$scope = $scope;
        this.isReady = false;
        this.$document = $document;
        this.$compile = $compile;

    }

    getPicture() {
        this.isReady = !this.isReady;
    }

    addLabel(title, type) {
        let el = angular.element('<div class="map-label-'+type+ ' map-label-'+type+'-lft" vrt-draggable data="'+type+'" ng-dblclick="vm.togglePoint($event)">'+title+'</div>');
        let target = this.$document[0].querySelector('#map-img');

        angular.element(target).append(this.$compile(el)(this.$scope));
        this.resetInput();
    }


    togglePoint(obj) {
        let className = obj.target.attributes.data.value;

        var el = angular.element(obj.target);
        el.toggleClass('map-label-' + className + '-rght');
        el.toggleClass('map-label-' + className +'-lft');
    }

    resetInput() {
        this.map = {};
    }
}

Controller.$inject = ['$scope', '$document', '$compile'];
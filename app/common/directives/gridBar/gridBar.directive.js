import './gridBar.directive.scss';
import template from './gridBar.directive.html';

class GridBarDirectiveController {
    constructor($scope, $log) {
        this.$scope = $scope;
        this.$log = $log;
        this.readOnly = true;
        this.style = { 'background-color': 'green', width: '2%' };




        // // ABSOLUTE VALUES
        // $scope.$watch('vm.value', (value) => {


        //     if (this.totalBar < value) {
        //         this.style = { 'background-color': 'red', width: '100%' };

        //     } else {
        //         this.width = value / this.totalBar * 100 + '%';
        //         this.style = { 'background-color': 'green', width: this.width };
        //     }
        // }, true);




        // PROCENTUAL VALUES
        $scope.$watch('vm.value', (value) => {


            if (this.totalBar < value) {
                this.style = { 'background-color': 'red', width: '100%' };
            } else {
                let procentPermitted = (this.totalBar / this.totalDay);
                let procentActual = (value / this.totalDay);
                this.width = procentActual / procentPermitted * 100 + '%';
                this.style = {width: this.width };
            }
        }, true);



    }
}

export const gridBarDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: GridBarDirectiveController,
        controllerAs: 'vm',
        transclude: true,
        bindToController: {
            totalDay: '=',
            totalBar: '=',
            value: '='
        },
    };
};

GridBarDirectiveController.$inject = ['$scope', '$log'];
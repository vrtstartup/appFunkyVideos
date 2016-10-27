import './style.scss';
import template from './template.html';

class veertienachtien01Controller {
    constructor($scope) {
        this.dateOne = new Date();
        this.dateTwo = new Date();
        $scope.$watch('vm.dateOne', (value) => {
            if (!value) return;
            this.newdate(value);
        });

    }

    newdate(date) {
        console.log(date);
        this.dateTwo.setDate(date.getDate() + 6);
        console.log(this.dateTwo);
    }
}

export const veertienachtien01Directive = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: veertienachtien01Controller,
        controllerAs: 'vm',
        bindToController: {
            dateOne: '=',
            image: '=',
            dateTwo: '=',
            imageSize: '=',
        },
    };
};

veertienachtien01Controller.$inject = ['$scope'];
import './style.scss';
import template from './template.html';

class drd05Controller {
    constructor($sce) {}
}

export const drd05Directive = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: drd05Controller,
        controllerAs: 'vm',
        bindToController: {
            templateClass: '=',
            imgOne: '=',
            imgOneSize: '=',
            imgTwo: '=',
            imgTwoSize: '=',
            imgThree: '=',
            imgThreeSize: '=',
            imgFour: '=',
            imgFourSize: '=',
            imgFive: '=',
            imgFiveSize: '=',
        },
    };
};

drd05Controller.$inject = ['$sce'];
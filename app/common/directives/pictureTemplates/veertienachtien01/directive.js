import './style.scss';
import template from './template.html';

class veertienachtien01Controller {
    constructor($sce) {}
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

veertienachtien01Controller.$inject = ['$sce'];
import './templateBob.directive.scss';
import template from './templateBob.directive.html';

class TemplateBobDirectiveController {
    constructor($sce) {

        this.html = $sce.trustAsResourceUrl('http://codepen.io/martyLauders/pen/xOovZR.html');
    }
}

export const templateBobDirective = function() {
    return {
        restrict: 'E',
        template: template,
        css: 'http://codepen.io/martyLauders/pen/xOovZR.css',
        scope: {},
        controller: TemplateBobDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            image: '=',
            templateClass: '=',
        },
    };
};

TemplateBobDirectiveController.$inject = ['$sce'];

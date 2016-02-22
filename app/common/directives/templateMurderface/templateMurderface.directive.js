import template from './templateMurderface.directive.html';

class TemplateMurderfaceDirectiveController {
    constructor(videoGeneration) {

        this.videoGeneration = videoGeneration;

        console.log('templateMurderface');

    }
}

export const templateMurderfaceDirective = function() {
    return {
        restrict: 'AE',
        template: template,
        scope: {},
        controller: TemplateMurderfaceDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            isHidden: '=',
        },
        transclude: true,
    };
};

TemplateMurderfaceDirectiveController.$inject = ['videoGeneration'];

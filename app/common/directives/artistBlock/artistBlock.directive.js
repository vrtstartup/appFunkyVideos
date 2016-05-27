import template from './artistBlock.directive.html';

class ArtistBlockDirectiveController {
    constructor() {

        console.log('ArtistBlockDirective');
    }
}

export const artistBlockDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: ArtistBlockDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            text: '=',
            image: '=',
            name: '=',
        },
    };
};

ArtistBlockDirectiveController.$inject = [];

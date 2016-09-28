import './artistBlock.directive.scss';
import template from './artistBlock.directive.html';

class ArtistBlockDirectiveController {
    constructor($scope) {
        // set the line length according to the first word length

        $scope.$watch('vm.name',(value) => {
            if(!value) return;

            this.calculateLineLength(value);

        });

    }

    calculateLineLength(name) {
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
            imageSize: '=',
            nummer: '=',
            isBottom: '=',
        },
    };
};

ArtistBlockDirectiveController.$inject = ['$scope'];

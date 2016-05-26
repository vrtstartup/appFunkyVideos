import './templateGiantBomb.directive.scss';
import template from './templateGiantBomb.directive.html';

class TemplateGiantBombDirectiveController {
    constructor($scope) {
        console.log('imageSize', this.imageSize);

        $scope.$watch('vm.imageSize', (value) => {
            if (!value) return;
            console.log('imageSize', value);
        });

    }
}

export const templateGiantBombDirective = function() {
    return {
        restrict: 'E',
        template: template,
        scope: {},
        controller: TemplateGiantBombDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            quote: '=',
            image: '=',
            templateClass: '=',
            numbr: '=',
            line1: '=',
            line2: '=',
            imageSize: '='
        },
    };
};

TemplateGiantBombDirectiveController.$inject = ['$scope'];
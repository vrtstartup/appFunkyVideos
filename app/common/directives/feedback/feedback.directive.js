import template from './feedback.directive.html';
import dialogTemplate from './feedback.dialog.directive.html';


class FeedbackDirectiveController {
    constructor($scope, $log, $element, $mdSidenav) {
        this.$log = $log;
        this.$element = $element;
        this.$scope = $scope;
        this.$mdSidenav = $mdSidenav;

        this.toggleRight = this.buildToggler('right');
        this.isOpenRight = function() {
            return this.$mdSidenav('right').isOpen();
        };
    }

    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    debounce(func, wait, context) {
            var timer;
            return function debounced() {
                var context = $scope,
                    args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function() {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        }
        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */
    buildDelayedToggler(navID) {
        return debounce(function() {
            this.$mdSidenav(navID)
                .toggle()
                .then(function() {

                });
        }, 200);
    }

    buildToggler(navID) {
        return function() {
            this.$mdSidenav(navID)
                .toggle()
                .then(function() {

                });
        };
    }




}

export const feedbackDirective = function() {
    return {
        restrict: 'AE',
        template: template,
        scope: {},
        controller: FeedbackDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            page: '=',
        },
    };
};

FeedbackDirectiveController.$inject = ['$scope', '$log', '$element', '$mdSidenav'];

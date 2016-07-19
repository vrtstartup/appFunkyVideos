import template from './feedback.directive.html';
import './feedback.directive.scss';

class FeedbackDirectiveController {
    constructor($scope, $log, $element, $mdSidenav, $http, toast, $window, $location, firebaseDB, $firebaseAuth) {
        this.$log = $log;
        this.$element = $element;
        this.$scope = $scope;
        this.$mdSidenav = $mdSidenav;
        this.$http = $http;
        this.toast = toast;
        this.$window = $window;
        this.$location = $location;
        this.feedback = {};
        this.firebaseDB = firebaseDB;
        this.firebaseDB.initialize();
        this.firebaseAuth = $firebaseAuth();


        this.toggleRight = this.buildToggler('right');

        this.firebaseAuth.$onAuthStateChanged((authData) => {
            if (authData) {
                console.log(authData);

                this.feedback.name = authData.email;
            }
        });

        this.isOpenRight = function() {
            return this.$mdSidenav('right').isOpen();
        };
    }


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

    sendToZapier() {
        if (!this.feedback) {
            this.toast.showToast('error', 'please fill in the required fields');
            return;
        }

        this.$http({
            method: 'GET',
            url: 'https://zapier.com/hooks/catch/2lf12p/',
            params: {
                'page': this.$location.$$path,
                'screenHeight': this.$window.innerHeight,
                'screenWidth': this.$window.innerWidth,
                'userAgent': window.navigator.userAgent,
                'name': this.feedback.name ? this.feedback.name : '',
                'text': this.feedback.name ? this.feedback.text : '',
            }
        }).then(() => {
            this.toast.showToast('success', 'Feedback is verstuurd');
            this.resetForm();
        }, (response) => {
            this.toast.showToast('error', response);
        });
    }

    resetForm() {
        this.feedback = {
            screenHeight: '',
            screenWidth: '',
            userAgent: '',
            name: '',
            text: '',
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
        bindToController: {},
    };
};

FeedbackDirectiveController.$inject = ['$scope', '$log', '$element', '$mdSidenav', '$http', 'toast', '$window', '$location', 'firebaseDB', '$firebaseAuth'];

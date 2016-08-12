import template from './feedback.directive.html';
import './feedback.directive.scss';

class FeedbackDirectiveController {
    constructor($scope, $log, $element, $mdSidenav, $http, toast, $window, $location, $firebaseAuth, $firebaseArray, firebaseDB) {
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
        this.$firebaseArray = $firebaseArray;


        this.toggleRight = this.buildToggler('right');



        this.firebaseAuth.$onAuthStateChanged((authData) => {
            if (authData) {
                console.log(authData);

                this.feedback.name = authData.email;
                this.initFirebase();
            }
        });

        this.isOpenRight = function() {
            return this.$mdSidenav('right').isOpen();
        };




    }


    initFirebase() {
        this.ref = firebase.database().ref().child('feedback');
        this.feedbacks = this.$firebaseArray(this.ref);
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

    sendToFirebase() {
        if (!this.feedback.text) {
            this.toast.showToast('error', 'please fill in the required fields');
            return;
        }

        this.feedback.page = this.$location.$$path;
        this.feedback.screenHeight = this.$window.innerHeight;
        this.feedback.screenWidth = this.$window.innerWidth;
        this.feedback.userAgent = window.navigator.userAgent;

        this.feedbacks.$add(this.feedback).then((ref) => {
            console.log('added');

            this.toggleRight();

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

FeedbackDirectiveController.$inject = ['$scope', '$log', '$element', '$mdSidenav', '$http', 'toast', '$window', '$location', '$firebaseAuth', '$firebaseArray', 'firebaseDB'];

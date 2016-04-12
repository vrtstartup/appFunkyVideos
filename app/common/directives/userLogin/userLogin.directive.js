import template from './userLogin.directive.html';
import './userLogin.directive.scss';

class UserLoginDirectiveController {
    constructor($scope, $log, $mdDialog, toast, firebaseAuth, $firebaseObject, $firebaseArray) {
        this.$log = $log;
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.toast = toast;
        this.firebaseAuth = firebaseAuth;
        this.$firebaseObject = $firebaseObject;
        this.$firebaseArray = $firebaseArray;

        // Check if user is logged in. If not: open popup.
        this.firebaseAuth.$onAuth((authData) => {
            if (authData) {
                this.userId = authData.uid;
            } else {
                this.userId = '';
                this.openLoginPopup();
            }
        });
    }

    logIn(user) {
        this.firebaseAuth.$authWithPassword({
            email: user.email,
            password: user.password
        }).then((userData) => {
            this.message = "User logged in with uid: " + userData.uid;
            // If we logged in, set userId and close the popup.
            this.userId = userData.uid;
            this.closePopup();
        }).catch((error) => {
            this.error = error;
        });
    }

    logOut() {
        this.firebaseAuth.$unauth();
    }


    createUser(user) {
        let domain = user.email.substring(user.email.lastIndexOf("@") + 1);
        if (domain === 'vrt.be') {
            this.firebaseAuth.$createUser({
                email: user.email,
                password: user.password
            }).then((userData) => {
                let ref = new Firebase('https://vrtnieuwshub.firebaseio.com/users/' + userData.uid);
                let obj = this.$firebaseObject(ref);

                obj.email = user.email;
                obj.$save().then(function(ref) {
                    // After we saved the user, log in.
                    this.logIn(user);
                }, function(error) {
                    console.log("Error:", error);
                });
            }).catch((error) => {
                this.error = error;
            });
        } else {
            this.error = 'Dit is geen geldig email adres!';
        }
    }

    closePopup() {

        // If the user is not logged in, do not make it possible to close the dialog.
        if (this.userId !== '') {

            this.$mdDialog.cancel();
        } else {
            this.error = 'Je moet eerst inloggen.';
        }
    }

    openLoginPopup(ev) {
        this.$mdDialog.show({
            templateUrl: '/common/directives/userLogin/login.dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            escapeToClose: false,
            scope: this.$scope,
            preserveScope: true
        });
    }


    // If user exists: log in,
    // if not: create.
    logInOrRegister(user) {
        // Check Firebase if user is already registered.
        const ref = new Firebase('https://vrtnieuwshub.firebaseio.com/users/');
        let query = ref.orderByChild('email').equalTo(user.email).on('value', (dataSnapshot) => {
            if (dataSnapshot.val() !== null) {
                // The user exists, so let's log in.
                this.logIn(user);
            } else {
                // The user doesn't exist yet, so let's create a new user.
                this.createUser(user);
            }
        });
    }
}

export const userLoginDirective = function() {
    return {
        restrict: 'AE',
        template: template,
        scope: {},
        controller: UserLoginDirectiveController,
        controllerAs: 'vm',
        bindToController: {},
    };
};

UserLoginDirectiveController.$inject = ['$scope', '$log', '$mdDialog', 'toast', 'firebaseAuth', '$firebaseObject', '$firebaseArray'];

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
        this.authenticated = false;
        this.accountVerified = false;
        this.userExists = false;
        this.userChecked = false;
        this.correctDomain = false;
        this.userId = '';
        this.userForm = {};


        // Check if user is logged in. If not: open popup.
        this.firebaseAuth.$onAuth((authData) => {
            if (authData) {
                //console.log(authData);
                this.authenticated = true;
                this.userId = authData.uid;

                let ref = new Firebase('https://vrtnieuwshub.firebaseio.com/users/' + this.userId);
                let obj = this.$firebaseObject(ref);
                //console.log(obj);
                // this.userForm.email = obj.email;

                // obj.verificationStatus = 'verified';

                this.checkAccountStatus(this.userId);
            } else {
                this.userId = '';
                this.openLoginPopup(this.userForm);
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
            // this.userId = userData.uid;
            this.closePopup();
        }).catch((error) => {
            this.error = error;
        });
    }


    activateUser(user) {
        this.firebaseAuth.$authWithPassword({
            email: user.email,
            password: user.oldPassword
        }).then((userData) => {
            this.setNewPassword(user);
            this.closePopup();
        }).catch((error) => {
            console.log(error);
        });
    }

    forgotPassword(user) {
        console.log(user);

        let ref = new Firebase('https://vrtnieuwshub.firebaseio.com/users/');
        let query = ref.orderByChild('email').equalTo(user.email).on('value', (snapshot) => {
            if (snapshot.val() !== null) {
                let data = snapshot.val();
                let key = Object.keys(data)[0];
                this.userId = Object.keys(data)[0];



                this.firebaseAuth.$resetPassword({
                    email: user.email
                }).then(() => {
                    console.log("Password reset email sent successfully!");

                    let ref = new Firebase('https://vrtnieuwshub.firebaseio.com/users/' + this.userId);
                    let obj = this.$firebaseObject(ref);
                    obj.email = user.email;
                    obj.verificationStatus = 'lostPassword';
                    obj.$save().then((ref) => {

                    }, function(error) {
                        console.log("Error:", error);
                    });


                    // this.closePopup();
                }).catch(function(error) {
                    console.error("Error: ", error);
                });



            } else {

            }
        });

    }

    logOut() {
        this.firebaseAuth.$unauth();
        this.userForm = {};
        this.authenticated = false;
        this.accountVerified = false;
        this.userExists = false;
        this.userChecked = false;
        this.correctDomain = false;
        this.userId = '';
    }

    setNewPassword(user) {
        this.firebaseAuth.$changePassword({
            email: user.email,
            oldPassword: user.oldPassword,
            newPassword: user.newPassword
        }).then((data) => {
            let ref = new Firebase('https://vrtnieuwshub.firebaseio.com/users/' + this.userId);
            let obj = this.$firebaseObject(ref);
            obj.verificationStatus = 'verified';
            obj.email = user.email;
            obj.$save().then((ref) => {
                this.closePopup();
            }, function(error) {
                console.log("Error:", error);
            });

        }).catch(function(error) {
            console.error("Error: ", error);
        });
    }

    generatePassword() {
        var possibleChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?_-';
        var password = '';
        for (var i = 0; i < 16; i += 1) {
            password += possibleChars[Math.floor(Math.random() * possibleChars.length)]
        }
        return password;
    }


    createUser(user) {
        let domain = user.email.substring(user.email.lastIndexOf("@") + 1);
        if (domain === 'vrt.be') {
            this.firebaseAuth.$createUser({
                email: user.email,
                password: this.generatePassword()
            }).then((userData) => {
                let ref = new Firebase('https://vrtnieuwshub.firebaseio.com/users/' + userData.uid);
                let obj = this.$firebaseObject(ref);
                obj.email = user.email;
                obj.verificationStatus = 'pending';
                obj.$save().then((ref) => {
                    console.log(ref);
                    console.log('reset password ');
                    this.firebaseAuth.$resetPassword({
                        email: user.email
                    }).then(() => {
                        console.log("Password reset email sent successfully!");
                        // this.closePopup();
                    }).catch(function(error) {
                        console.error("Error: ", error);
                    });

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
            this.user = {};
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


    checkAccountStatus(userId) {
        let ref = new Firebase('https://vrtnieuwshub.firebaseio.com/users/' + userId);
        let obj = this.$firebaseObject(ref);
        obj.$loaded()
            .then((data) => {
                this.userForm.email = data.email;
                if (data.verificationStatus === 'pending' || data.verificationStatus === 'lostPassword') {
                    this.accountVerified = false;
                    this.openLoginPopup(this.userForm);
                } else {
                    this.accountVerified = true;
                }
            })
            .catch(function(error) {
                console.error("Error:", error);
            });
    }


    checkIfExistingUser(email) {
        let domain = email.substring(email.lastIndexOf("@") + 1);
        if (domain === 'vrt.be') {
            this.correctDomain = true;
            // Check Firebase if user is already registered.
            let ref = new Firebase('https://vrtnieuwshub.firebaseio.com/users/');
            let query = ref.orderByChild('email').equalTo(email).on('value', (snapshot) => {
                if (snapshot.val() !== null) {
                    let data = snapshot.val();
                    let key = Object.keys(data)[0];
                    this.userId = Object.keys(data)[0];
                    this.userExists = true;
                    this.userChecked = true;
                    this.checkAccountStatus(this.userId);
                } else {
                    this.userExists = false;
                    this.userChecked = true;
                }
            });
        } else {
            this.userChecked = true;
            this.correctDomain = false;
        }
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

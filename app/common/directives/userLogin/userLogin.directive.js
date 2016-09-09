import template from './userLogin.directive.html';
import './userLogin.directive.scss';

class UserLoginDirectiveController {
    constructor($scope, $log, $mdDialog, toast, userManagement) {
        this.$log = $log;
        this.$scope = $scope;
        this.$mdDialog = $mdDialog;
        this.toast = toast;
        this.userManagement = userManagement;
        this.accountStatus = 'notChecked';
        this.authenticated = false;
        this.accountVerified = false;
        this.userExists = false;
        this.userChecked = false;
        this.correctDomain = false;
        this.userId = '';
        this.userForm = {};



        this.brands = [{
            'name': 'deredactie.be',
            'logo': 'assets/logos/deredactie.png'
        }, {
            'name': 'sporza',
            'logo': 'assets/logos/sporza.png'
        }, {
            'name': 'radio 1',
            'logo': 'assets/logos/radio1.png'
        }, {
            'name': 'canvas',
            'logo': 'assets/logos/canvas.png'
        }, {
            'name': 'radio 2',
            'logo': 'assets/logos/radio2.png'
        }, {
            'name': 'amerika kiest',
            'logo': 'assets/logos/amerikakiest.png'
        }, {
            'name': 'MNM',
            'logo': 'assets/logos/mnm.png'
        }, {
            'name': 'stubru',
            'logo': 'assets/logos/stubru.png'
        }, {
            'name': 'Generation What',
            'logo': 'assets/logos/generationwhat.png'
        }, {
            'name': 'een',
            'logo': 'assets/logos/een.png'
        }, {
            'name': 'de zevende dag',
            'logo': 'assets/logos/dezevendedag.png'
        }];

        this.userManagement.checkAuth().then((authData) => {
            if (authData !== null) {
                console.log(authData);
                this.userId = authData.uid;
                this.userForm.brand = authData.brand;
                this.userForm.email = authData.email;
                this.accountStatus = 'loggedIn';
            } else {
                this.openLoginPopup(this.userForm);
            }
        }, (reason) => {
            console.log('Failed: ' + reason);
            this.accountStatus = 'notAuthenticated';
            this.openLoginPopup(this.userForm);
        });
    }

    logIn(user) {
        user.email = user.email.toLowerCase();
        this.userManagement.logIn(user.email, user.password).then((userId, message) => {
            this.message = message;
            this.userId = userId;
            this.accountStatus = 'loggedIn';
            this.closePopup();
        }, (error) => {
            this.message = error.message;

        });
    }

    // activateUser(user) {
    //     user.email = user.email.toLowerCase();
    //     console.log(user.email);
    //     this.userManagement.authenticate(user.email, user.oldPassword).then((authData, message) => {
    //         this.userManagement.changePassword(user.email, user.oldPassword, user.newPassword).then((data, message, error) => {
    //             this.message = message;
    //             this.userManagement.setVerificationStatus(authData.uid, user.email, user.brand, 'verified').then(() => {
    //                 this.accountStatus = 'verified';
    //             }, (reason) => {
    //                 console.log('Failed: ' + reason);
    //             })
    //             this.closePopup();
    //         }, (reason) => {
    //             console.log('Failed: ' + reason);
    //         });
    //     }, (reason) => {
    //         console.log('Failed: ' + reason);
    //     });
    // }

    // forgotPassword(user) {
    //     user.email = user.email.toLowerCase();
    //     this.userManagement.resetPassword(user.email).then((response, message) => {
    //         this.message = message;
    //         if (response === 'success') {
    //             this.userManagement.getUserIdFromEmail(user.email).then((userId) => {
    //                 this.userManagement.setVerificationStatus(userId, 'lostPassword').then(() => {
    //                     this.accountStatus = 'lostPassword';
    //                 }, (reason) => {
    //                     console.log('setVerificationStatus failed: ' + reason);
    //                 });
    //             }, (reason) => {
    //                 console.log('getUserIdFromEmail failed: ' + reason);
    //             });
    //         }
    //     }, (reason) => {
    //         console.log('resetPassword failed: ' + reason);
    //     });
    // }


    logOut() {

        this.userManagement.logOut().then(() => {
            this.userForm = {};
            this.accountStatus = 'loggedOut';
            this.correctDomain = false;
            this.userId = '';

        });
    }

    createUser(user) {
        console.log('creating User:', user);
        user.email = user.email.toLowerCase();

        this.userManagement.checkDomain(user.email).then((domain) => {
            this.userManagement.createUser(user.email, user.password).then((uid) => {
                console.log('saving user to firebase:', user);
                this.userManagement.saveToFirebase(uid, user.email, user.brand, '2').then(() => {
                    this.logIn(user);
                    // this.userManagement.resetPassword(user.email).then((response, message) => {
                    //     this.message = message;
                    //     if (response === 'success') {
                    //         this.userId = userData.uid;
                    //         this.accountStatus = 'verified';
                    //     }
                    // });
                });
            });
        });
    }



    changeBrand(newBrand) {

        this.userManagement.setBrand(newBrand, this.userId).then(() => {});
    }


    closePopup() {
        // If the user is not logged in, do not make it possible to close the dialog.
        if (this.userId !== '') {
            this.$mdDialog.cancel();
            this.user = {};
        } else {
            this.message = 'Je moet eerst inloggen.';
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


    checkIfExistingUser(email) {
        email = email.toLowerCase();
        this.message = '';
        this.userManagement.checkDomain(email).then((domain) => {
            if (domain === 'vrt.be') {
                this.accountStatus = 'domainTrue';
                this.userManagement.getUserIdFromEmail(email).then((userId) => {


                    this.accountStatus = 'existsTrue';

                    this.userManagement.checkAccountStatus(userId).then((obj, message) => {
                        this.accountStatus = 'existsTrue';

                        // if (obj.verificationStatus === 'pendingVerification' || obj.verificationStatus === 'lostPassword') {
                        //     this.accountStatus = obj.verificationStatus;
                        //     this.openLoginPopup(this.userForm);
                        // } else {
                        //     this.accountStatus = 'verified';
                        // }
                    });
                }, (reason) => {
                    console.log('Failed: ' + reason);
                    this.message = 'Je bent nog niet geregistreerd. Wil je een account aanmaken?';
                    this.accountStatus = 'existsFalse';

                });
            } else {
                this.message = 'Dit is geen vrt.be adres, hiermee kan je geen account aanmaken.';
                this.accountStatus = 'domainFalse';
            }
        }, (reason) => {
            console.log('Failed: ' + reason);
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

UserLoginDirectiveController.$inject = ['$scope', '$log', '$mdDialog', 'toast', 'userManagement'];
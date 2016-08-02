export default class UserManagemeService {
    constructor($q, firebaseDB, $firebaseAuth) {
        this.$q = $q;
        this.firebaseAuth = $firebaseAuth();
        this.ref = firebase.database().ref();
    }


    _generatePassword() {
        var possibleChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?_-';
        var password = '';
        for (var i = 0; i < 16; i += 1) {
            password += possibleChars[Math.floor(Math.random() * possibleChars.length)];
        }
        return password;
    }


    checkAuth() {
        const deferred = this.$q.defer();
        let message = '';
        this.firebaseAuth.$onAuthStateChanged((authData) => {
            //console.log(authData);
            if (authData !== null) {
                deferred.resolve(authData.uid);
            } else {
                deferred.reject('not authenticated');
            }
        });
        return deferred.promise;
    }

    logIn(email, password) {
        const deferred = this.$q.defer();
        let message = '';
        this.firebaseAuth.$signInWithEmailAndPassword(email, password).then((authData) => {
            message = 'Je bent ingelogd met het email adres ' + email;
            deferred.resolve(authData.uid, message);

        }).catch((error) => {
            console.log(error.code);
            switch (error.code) {
                case "INVALID_EMAIL":
                    error.message = 'Dit email adres is niet geregistreerd.';
                    deferred.reject(error);
                    break;
                case "auth/wrong-password":
                    error.message = 'Het paswoord is niet correct.';
                    deferred.reject(error);
                    break;
                case "INVALID_USER":
                    error.message = 'Deze gebruiker is niet geregistreerd';
                    deferred.reject(error);
                    break;
                default:
                    error.message = 'Error logging user in: ' + error;
                    deferred.reject(error);
            }
        });
        return deferred.promise;
    }


    logOut() {
        const deferred = this.$q.defer();
        this.firebaseAuth.$signOut();
        deferred.resolve();
        return deferred.promise;
    }



    authenticate(email, oldPassword) {
        const deferred = this.$q.defer();
        let message = '';
        this.firebaseAuth.$signInWithEmailAndPassword(email, oldPassword).then((authData) => {
            message = 'Je account is geactiveerd';
            console.log(authData, message);
            deferred.resolve(authData, message);
        }).catch((error) => {
            console.log(error);
            deferred.reject(error);
        });
        return deferred.promise;
    }



    changePassword(email, oldPassword, newPassword) {
        const deferred = this.$q.defer();
        let message = '';
        this.firebaseAuth.$updatePassword(newPassword).then((data) => {
            message = 'Het paswoord is opgeslagen.';
            deferred.resolve(data, message);
        }).catch(function(error) {
            deferred.reject('', error);
        });
        return deferred.promise;
    }


    getUserIdFromEmail(email) {
        const deferred = this.$q.defer();
        let message = '';


        let query = this.ref.child('users').orderByChild('email').equalTo(email).on('value', (snapshot) => {
            if (snapshot.val() !== null) {
                let data = snapshot.val();
                let userId = Object.keys(data)[0];
                deferred.resolve(userId);
            } else {
                deferred.reject('could not find user');
            }
        });
        return deferred.promise;
    }

    resetPassword(email) {
        const deferred = this.$q.defer();
        let message = '';
        this.firebaseAuth.$sendPasswordResetEmail(email).then(() => {
            message = 'Password reset email sent successfully!';
            deferred.resolve('success', message);
        }).catch(function(error) {
            message = error;
            deferred.resolve('failed', message);
        });
        return deferred.promise;
    }


    setBrand(brand, userId) {
        const deferred = this.$q.defer();
        this.ref.child('users/' + userId + '/brand').set(brand);
        deferred.resolve();
        return deferred.promise;
    }



    setVerificationStatus(userId, email, brand, status) {
        console.log(userId, email, brand, status);
        const deferred = this.$q.defer();
        this.ref.child('users/' + userId + '/verificationStatus').set(status);
        if (email) {
            this.ref.child('users/' + userId + '/email').set(email);
        }

        if (brand) {
            this.ref.child('users/' + userId + '/brand').set(brand);
        }
        deferred.resolve();
        return deferred.promise;
    }


    createUser(email) {
        const deferred = this.$q.defer();
        let message = '';
        console.log(email);
        this.firebaseAuth.$createUserWithEmailAndPassword(email, this._generatePassword()).then((userData) => {

            message = 'User created';
            console.log(userData);
            deferred.resolve(userData, message);
        }).catch((error) => {
            console.log(error);
            deferred.reject(error);
        });
        return deferred.promise;
    }


    checkAccountStatus(userId) {
        const deferred = this.$q.defer();
        let message = '';
        console.log(userId);
        this.ref.child('users/' + userId).on("value", function(snapshot) {
            console.log(snapshot.val());
            deferred.resolve(snapshot.val(), 'success');
        }, function(errorObject) {
            deferred.reject(errorObject.code);
        });
        return deferred.promise;
    }


    checkDomain(email) {
        const deferred = this.$q.defer();
        let domain = (email.substring(email.lastIndexOf("@") + 1)).toLowerCase();
        deferred.resolve(domain);
        return deferred.promise;

    }

}

UserManagemeService.$inject = ['$q', 'firebaseDB', '$firebaseAuth'];

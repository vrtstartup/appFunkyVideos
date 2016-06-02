export default class UserManagemeService {
    constructor($q, firebaseAuth) {
        this.$q = $q;
        this.firebaseAuth = firebaseAuth;
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
        this.firebaseAuth.$onAuth((authData) => {
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
        this.firebaseAuth.$authWithPassword({
            email: email,
            password: password
        }).then((authData) => {
            message = 'Je bent ingelogd met het email adres ' + email;
            deferred.resolve(authData.uid, message);

        }).catch((error) => {
            switch (error.code) {
                case "INVALID_EMAIL":
                    message = 'Dit email adres is niet geregistreerd.';
                    deferred.reject('', message);
                    break;
                case "INVALID_PASSWORD":
                    message = 'Het paswoord is niet correct.';
                    deferred.reject('', message);
                    break;
                case "INVALID_USER":
                    message = 'Deze gebruiker is niet geregistreerd';
                    deferred.reject('', message);
                    break;
                default:
                    message = 'Error logging user in: ' + error;
                    deferred.reject('', message);
            }
        });
        return deferred.promise;
    }


    logOut() {
        const deferred = this.$q.defer();
        this.firebaseAuth.$unauth();
        deferred.resolve();
        return deferred.promise;
    }



    authenticate(email, oldPassword) {
        const deferred = this.$q.defer();
        let message = '';
        this.firebaseAuth.$authWithPassword({
            email: email,
            password: oldPassword
        }).then((authData) => {
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
        this.firebaseAuth.$changePassword({
            email: email,
            oldPassword: oldPassword,
            newPassword: newPassword
        }).then((data) => {
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
        let ref = new Firebase('https://vrtnieuwshub.firebaseio.com/users/');
        let query = ref.orderByChild('email').equalTo(email).on('value', (snapshot) => {
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
        this.firebaseAuth.$resetPassword({
            email: email
        }).then(() => {
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
        let ref = new Firebase('https://vrtnieuwshub.firebaseio.com/users/' + userId);
        ref.child('brand').set(brand);
        deferred.resolve();
        return deferred.promise;
    }



    setVerificationStatus(userId, email, brand, status) {
        console.log(userId, email, brand, status);
        const deferred = this.$q.defer();
        let ref = new Firebase('https://vrtnieuwshub.firebaseio.com/users/' + userId);
        ref.child('verificationStatus').set(status);
        if (email) {
            ref.child('email').set(email);
        }

        if (brand) {
            ref.child('brand').set(brand);
        }
        deferred.resolve();
        return deferred.promise;
    }


    createUser(email) {
        const deferred = this.$q.defer();
        let message = '';
        console.log(email);
        this.firebaseAuth.$createUser({
            email: email,
            password: this._generatePassword()
        }).then((userData) => {

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
        let ref = new Firebase('https://vrtnieuwshub.firebaseio.com/users/' + userId);
        ref.on("value", function(snapshot) {
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

UserManagemeService.$inject = ['$q', 'firebaseAuth'];

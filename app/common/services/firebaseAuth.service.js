export default class firebaseAuthService {
    constructor($firebaseAuth) {
        this.$firebaseAuth = $firebaseAuth;
        const ref = new Firebase('https://vrtnieuwshub.firebaseio.com');
        return this.$firebaseAuth(ref);
    }

}

firebaseAuthService.$inject = ['$firebaseAuth'];
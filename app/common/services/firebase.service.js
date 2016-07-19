export default class firebaseDBService {
    constructor() {
        this.config = {
            apiKey: "AIzaSyDJ1ASQGT3vqAzUOHBtKrtuzYh7i91dqmU",
            authDomain: "vrtnieuwshub.firebaseapp.com",
            databaseURL: "https://vrtnieuwshub.firebaseio.com",
            storageBucket: "project-1407104807720831955.appspot.com",
        };
    }

    initialize() {
        var instance, storageInstance = null;
        instance = firebase.initializeApp(this.config);
        storageInstance = firebase.storage();
    }
}

firebaseDBService.$inject = [];
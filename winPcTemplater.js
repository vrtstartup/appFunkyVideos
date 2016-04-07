var Firebase = require('firebase');

var firebaseRef = new Firebase("https://vrtnieuwshub.firebaseio.com");

firebaseRef.on("value", function(snapshot) {
    console.log(snapshot.val());
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});
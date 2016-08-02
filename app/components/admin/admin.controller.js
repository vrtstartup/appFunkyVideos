export default class AdminController {
    constructor($log, $firebaseArray, $timeout) {
        this.$log = $log;
        this.$firebaseArray = $firebaseArray;

        // The reference to the firebase
        this.ref = firebase.database().ref();
        this.projectsRef = this.ref.child('apps/subtitles');
        let query = this.projectsRef.orderByChild('meta/projectId').limitToLast(20);
        this.projects = this.$firebaseArray(query);

        this.projects.$watch(function(event) {
            // this.triggerChange(event.event, event.key);
            if (event.event === 'child_changed') {
                console.log('child changed');
                angular.element(document.querySelector('#id-' + event.key)).addClass("active");
                $timeout(function() {
                    angular.element(document.querySelector('#id-' + event.key)).removeClass("active");
                }, 1000);
            }

        });
    }


    // triggerChange(event, key) {
    //     console.log();
    //     if (event === 'child_changed') {
    //         angular.element('#id-' + key).addClass("active");
    //         $timeout(function() {
    //             angular.element('#id-' + key).removeClass("active");
    //         }, 300);
    //     }

    // }
}

AdminController.$inject = ['$log', '$firebaseArray', '$timeout'];

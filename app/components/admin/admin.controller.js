export default class AdminController {
    constructor($log, $firebaseArray, $timeout) {
        this.$log = $log;
        this.$firebaseArray = $firebaseArray;

        this.roles = [{
            id: 0,
            name: 'admin'

        }, {
            id: 1,
            name: 'tester'
        }, {
            id: 2,
            name: 'user'
        }];
        // The reference to the firebase
        this.ref = firebase.database().ref();
        this.projectsRef = this.ref.child('apps/subtitles');
        let projectsQuery = this.projectsRef.orderByChild('meta/projectId').limitToLast(20);
        this.projects = this.$firebaseArray(projectsQuery);

        this.projects.$watch(function(event) {
            // this.triggerChange(event.event, event.key);
            if (event.event === 'child_changed') {
                angular.element(document.querySelector('#id-' + event.key)).addClass("active");
                $timeout(function() {
                    angular.element(document.querySelector('#id-' + event.key)).removeClass("active");
                }, 1000);
            }

        });





        this.usersRef = this.ref.child('users');
        let usersQuery = this.usersRef.orderByChild('email');
        this.users = this.$firebaseArray(usersQuery);

        this.orderUsers = 'email';
    }


    changeRole(userId) {

    }
}

AdminController.$inject = ['$log', '$firebaseArray', '$timeout'];

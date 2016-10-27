export default class QuestionsController {
    constructor($log, $firebaseArray) {
        this.$log = $log;
        this.$firebaseArray = $firebaseArray;
        this.activeSession = '';
        this.sessionInput = '';
        this.questionInput = '';
        this.live = false;
        // The reference to the firebase
        this.ref = firebase.database().ref();
        this.questionsAppRef = this.ref.child('apps/questions');

        this.getSessions();

    }

    getSession(session) {
        this.activeSession = session;
        let query = this.questionsAppRef.child(session + '/questions').orderByChild('addedDate');
        this.questions = this.$firebaseArray(query);

        // this.watchFirebase();
    }

    getSessions() {
        let query = this.questionsAppRef.orderByChild('timestamp');
        this.sessions = this.$firebaseArray(query);
    }

    addQuestion(question, type) {
        question.type = type;
        console.log(question.name);
        if (question.name == null) {
            question.name === 'anoniem';
        }
        question.timestamp = firebase.database.ServerValue.TIMESTAMP;
        this.questions.$add(question).then((ref) => {
            this.questionInput = '';
        });
    }

    addSession(session) {
        session.timestamp = firebase.database.ServerValue.TIMESTAMP;
        this.sessions.$add(session).then((ref) => {
            this.getSession(ref.key);
            this.sessionInput = '';
        });
    }




    deleteQuestion(q) {
        this.questions.$remove(q).then(function(ref) {

        });
    }


    deleteSession(s) {
        this.sessions.$remove(s).then(function(ref) {

        });
    }






}

QuestionsController.$inject = ['$log', '$firebaseArray'];
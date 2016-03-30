export default class QuestionsController {
    constructor($log, $firebaseArray) {
        this.$log = $log;
        this.$firebaseArray = $firebaseArray;

        // The reference to the firebase
        this.questionsAppRef = new Firebase('vrtnieuwshub.firebaseio.com/apps/questions');
        this.getSessions();

    }

    getQuestions(question) {
        let query = this.questionsAppRef.child(question + '/questions').orderByChild('addedDate');
        this.questions = this.$firebaseArray(query);

        // this.watchFirebase();
    }

    getSessions() {
        let query = this.questionsAppRef.orderByChild('timestamp');
        this.sessions = this.$firebaseArray(query);
        // this.watchFirebase();
    }

    addQuestion(question) {
        question.timestamp = Firebase.ServerValue.TIMESTAMP;
        this.questions.$add(question).then(function(ref) {

        });
    }


    addSession(session) {
        session.timestamp = Firebase.ServerValue.TIMESTAMP;
        this.sessions.$add(session).then((ref) => {
            this.getQuestions(ref.key());



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
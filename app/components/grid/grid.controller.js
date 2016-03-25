export default class GridController {
    constructor($log, $firebaseArray) {
        this.$log = $log;
        this.$firebaseArray;
        this.post = '';
        this.total = {
            category: [0, 0, 0],
            type: [0, 0, 0],
            day: 16,
        };


        this.categories = [{
            'name': 'hard',
            'descr': 'Hard Nieuws',
            'max': 6,
            'value': 0
        }, {
            'name': 'wetteclife',
            'descr': 'Wetenschap, Tech, Lifestyle',
            'max': 4,
            'value': 0
        }, {
            'name': 'ookdatnog',
            'descr': 'Ook dat nog',
            'max': 3,
            'value': 0
        }, {
            'name': 'cultuurmedia',
            'descr': 'Cultuur en Media',
            'max': 3,
            'value': 0
        }, {
            'name': 'opinie',
            'descr': 'Opinie',
            'max': 2,
            'value': 0
        }, {
            'name': 'vrtmerk',
            'descr': 'Vrt als merk',
            'max': 2,
            'value': 0
        }];

        this.types = [{
            'name': 'traditioneel',
            'descr': 'Traditioneel',
            'max': 8,
            'value': 0
        }, {
            'name': 'nativevideo',
            'descr': 'Native video',
            'max': 7,
            'value': 0
        }, {
            'name': 'nativetekst',
            'descr': 'Native tekst',
            'max': 3,
            'value': 0
        }, {
            'name': 'shares',
            'descr': 'Shares',
            'max': 2,
            'value': 0
        }];


        var postsRef = new Firebase('vrtnieuwshub.firebaseio.com/apps/grid').child("posts");
        var query = postsRef.orderByChild("timestamp").limitToLast(30);
        this.posts = $firebaseArray(query);


        this.posts.$watch((event) => {

            // Reset the value of the categories
            for (let i = 0; i < this.categories.length; i++) {
                this.categories[i].value = 0;
            }

            // Reset the value of the types
            for (let i = 0; i < this.types.length; i++) {
                this.types[i].value = 0;
            }

            // variable to count the number of posts
            let totalPosts = 0;

            // Loop through all the posts
            for (let i = 0; i < this.posts.length; i++) {

                // Count the number of posts
                totalPosts++;

                // If the number of posts is bigger than the total that is permitted, the permitted total changes in the real total
                if (totalPosts > this.total.day) {
                    this.total.day = totalPosts;
                }

                // Count the different categories
                this.checkCategory(this.posts[i].category);

                // Count the different types
                this.checkType(this.posts[i].type);
            }
        });
    }

    checkCategory(c) {
        for (let i = 0; i < this.categories.length; i++) {
            if (c === this.categories[i].name) {
                this.categories[i].value++;
            }
        }
    }

    checkType(t) {
        for (let i = 0; i < this.types.length; i++) {
            if (t === this.types[i].name) {
                this.types[i].value++;
            }
        }
    }


    addItem(post) {
        post.timestamp = Firebase.ServerValue.TIMESTAMP;
        this.posts.$add(post).then(function(ref) {
            console.log(ref);
        });

    }





}

GridController.$inject = ['$log', '$firebaseArray', '$firebaseObject'];
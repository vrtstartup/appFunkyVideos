export default class GridController {
    constructor($log, $firebaseArray) {
        this.$log = $log;
        this.$firebaseArray = $firebaseArray;
        this.post = '';
        this.totalDay = 30;



        this.categories = [{
            'name': 'hard',
            'descr': '1. Hard Nieuws',
            'max': 8,
            'value': 0
        }, {
            'name': 'lokaal',
            'descr': '2. Lokaal nieuws',
            'max': 4,
            'value': 0
        }, {
            'name': 'sport',
            'descr': '3. Sport',
            'max': 2,
            'value': 0
        }, {
            'name': 'techwet',
            'descr': '4. Technologie & Wetenschap',
            'max': 4,
            'value': 0
        }, {
            'name': 'lifeontsp',
            'descr': '5. Lifestyle & Ontspanning',
            'max': 4,
            'value': 0
        }, {
            'name': 'cultmedia',
            'descr': '6. Cultuur en Media',
            'max': 4,
            'value': 0
        }, {
            'name': 'ookdatnog',
            'descr': '7. Ook dat nog',
            'max': 4,
            'value': 0
        }];


// Native video 14, templates 6, link 6  shares 3, fotoreeks of poll 1

        this.types = [{
            'name': 'traditioneel',
            'descr': 'Traditionele link',
            'max': 6,
            'value': 0
        },{
            'name': 'fotoreeks',
            'descr': 'Fotoreeks',
            'max': 1,
            'value': 0
        }, {
            'name': 'nativevideo',
            'descr': 'Native video',
            'max': 6,
            'value': 0
        }, {
            'name': 'socialtemplate',
            'descr': 'Social templates',
            'max': 6,
            'value': 0
        }, {
            'name': 'share',
            'descr': 'Share',
            'max': 3,
            'value': 0
        }, {
            'name': 'poll',
            'descr': 'Poll',
            'max': 1,
            'value': 0
        }];

        // The reference to the firebase
        this.ref = firebase.database().ref();
        this.postsRef = this.ref.child('apps/grid/posts');

        // Start with a single date, instead of a range
        this.range = false;

        // Get the date of today
        this.minDate = new Date();
        this.maxDate = new Date();

        // Get the posts that are made or planned today
        this.getPosts(this.rewriteDate(this.minDate), this.rewriteDate(this.maxDate), this.range);


    }

    // Check
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


    getPosts(minDate, maxDate, range) {

        let query = '';
        if (range) {
            query = this.postsRef.orderByChild('addedDate').startAt(minDate).endAt(maxDate);
        } else {
            query = this.postsRef.orderByChild('addedDate').equalTo(minDate);
        }
        this.posts = this.$firebaseArray(query);
        this.watchFirebase();
    }

    addPost(post) {
        post.timestamp = {};
        post.timestamp = firebase.database.ServerValue.TIMESTAMP;
        post.addedDate = this.rewriteDate(this.minDate);
        this.posts.$add(post).then(function(ref) {
            console.log(ref);
        });
    }



    deletePost(post) {
        console.log(post);
        this.posts.$remove(post).then(function(ref) {
            console.log(ref);
        });
    }



    resetTotals() {
        // Reset the value of the categories
        for (let i = 0; i < this.categories.length; i++) {
            this.categories[i].value = 0;
        }

        // Reset the value of the types
        for (let i = 0; i < this.types.length; i++) {
            this.types[i].value = 0;
        }
    }

    watchFirebase() {
        this.posts.$watch((event) => {

            this.resetTotals();
            // variable to count the number of posts
            let totalPosts = 0;

            // Loop through all the posts
            for (let i = 0; i < this.posts.length; i++) {

                // Count the number of posts
                totalPosts++;

                // If the number of posts is bigger than the total that is permitted, the permitted total changes in the real total
                if (totalPosts > this.totalDay) {
                    this.totalDay = totalPosts;
                }

                // Count the different categories
                this.checkCategory(this.posts[i].category);

                // Count the different types
                this.checkType(this.posts[i].type);
            }
        });
    }


    rewriteDate(date) {
        var currentDate = date;
        var twoDigitMonth = ((currentDate.getMonth() + 1) >= 10) ? (currentDate.getMonth() + 1) : '0' + (currentDate.getMonth() + 1);
        var twoDigitDate = ((currentDate.getDate()) >= 10) ? (currentDate.getDate()) : '0' + (currentDate.getDate());
        var createdDateTo = currentDate.getFullYear() + "" + twoDigitMonth + "" + twoDigitDate;
        return createdDateTo;
    }




    dateChanged(minDate, maxDate) {
        // Set all total to zero, so we can make te sum based on the new search
        this.resetTotals();
        // Get posts based on chosen date or daterange
        this.getPosts(this.rewriteDate(minDate), this.rewriteDate(maxDate), this.range);

        }



    }

    GridController.$inject = ['$log', '$firebaseArray'];
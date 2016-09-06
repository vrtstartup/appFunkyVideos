export default class GridController {
    constructor($log, $firebaseArray, $firebaseObject) {
        this.$log = $log;
        this.$firebaseArray = $firebaseArray;
        this.$firebaseObject = $firebaseObject;
        this.post = '';
        this.totalDay = 30;
        this.range = false;
        this.overview = {};
        this.showTotals = false;
        this.numberOfDays = 1;


        this.labels = [];
        this.series = ['hard', 'standaard', 'sport', 'techwet', 'opinieanalyse', 'cultmedia', 'ookdatnog'];
        this.options = {
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true
                }]
            }

        }
        this.data = [
            [],
            [],
            [],
            [],
            [],
            [],
            [],
        ];



        this.categories = [{
            'name': 'hard',
            'descr': '1. Hard Nieuws',
            'max': 10,
            'value': 0
        }, {
            'name': 'standaard',
            'descr': '2. Standaard nieuws',
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
            'name': 'opinieanalyse',
            'descr': '5. Opinie en Analyse',
            'max': 2,
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
            'max': 8,
            'value': 0
        }, {
            'name': 'fotoreeks',
            'descr': 'Fotoreeks',
            'max': 1,
            'value': 0
        }, {
            'name': 'nativevideo',
            'descr': 'Native video',
            'max': 7,
            'value': 0
        }, {
            'name': 'socialtemplate',
            'descr': 'Social templates',
            'max': 8,
            'value': 0
        }, {
            'name': 'share',
            'descr': 'Share',
            'max': 4,
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
        this.daysRef = this.ref.child('apps/grid/days');

        // Start with a single date, instead of a range
        this.range = false;

        // Get the date of today
        this.minDate = new Date();
        this.maxDate = new Date();

        // Get the posts that are made or planned today
        this.getPosts(this.rewriteDate(this.minDate), this.rewriteDate(this.maxDate), this.range);

        // Get the day Object and check if breaking day
        this.getDay(this.rewriteDate(this.minDate));

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


    count() {

        var counts = {};
        dates.forEach(function(x) {
            counts[x] = (counts[x] || 0) + 1;
        });

    }


    getDay(date) {
        let query = this.daysRef.orderByChild('date').equalTo(date);
        this.days = this.$firebaseArray(query);

        this.days.$loaded()
            .then((x) => {
                if (this.days.length === 0) {
                    let day = [];
                    day.date = date;
                    day.breaking = false;
                    this.days.$add(day).then(function(ref) {
                        console.log(ref);
                    });
                } else {

                    for (var i = 0, len = this.days.length; i < len; i++) {
                        console.log(this.days[i]);
                        if (this.days[i].date === date) {
                            console.log('this day exists');
                            console.log(this.days[i].breaking);
                        } else {
                            console.log('this day doesnt exist yet');
                            let day = [];
                            day.date = date;
                            day.breaking = false;
                            this.days.$add(day).then(function(ref) {

                            });
                        }
                    }
                }


            })
            .catch((error) => {
                console.log("Error:", error);
            });



    }


    getMonthlyValues() {
        let posts = '';
        let days = '';
        let str = '';
        let counts = [];
        let months = {
            '01': 'Jan',
            '02': 'Feb',
            '03': 'Maa',
            '04': 'Apr',
            '05': 'Mei',
            '06': 'Jun',
            '07': 'Jul',
            '08': 'Aug',
            '09': 'Sep',
            '10': 'Okt',
            '11': 'Nov',
            '12': 'Dec'
        };


        posts = this.$firebaseArray(this.postsRef);
        posts.$loaded()
            .then((x) => {

                for (var i = 0, len = posts.length; i < len; i++) {
                    if (posts[i].addedDate) {
                        let total = '';
                        let month = '';
                        str = posts[i].addedDate.slice(0, -2);
                        if (!(str in counts)) {
                            let month = str.slice(-2);
                            counts[str] = {
                                total: 1,
                                year: str.slice(0, -2),
                                month: months[month]
                            };
                            if (posts[i].category === 'hard') {
                                counts[str].hard = 1;

                            }

                            if (posts[i].category === 'standaard') {
                                counts[str].standaard = 1;
                            }

                            if (posts[i].category === 'sport') {
                                counts[str].sport = 1;
                            }


                        } else {
                            counts[str].total = counts[str].total + 1;
                            if (posts[i].category === 'hard') {
                                if (counts[str].hard) {
                                    counts[str].hard = counts[str].hard + 1;
                                } else {
                                    counts[str].hard = 1;
                                }
                            }

                            if (posts[i].category === 'standaard') {
                                if (counts[str].standaard) {
                                    counts[str].standaard = counts[str].standaard + 1;
                                } else {
                                    counts[str].standaard = 1;
                                }
                            }


                            if (posts[i].category === 'sport') {
                                if (counts[str].sport) {
                                    counts[str].sport = counts[str].sport + 1;
                                } else {
                                    counts[str].sport = 1;
                                }
                            }


                            if (posts[i].category === 'techwet') {
                                if (counts[str].techwet) {
                                    counts[str].techwet = counts[str].techwet + 1;
                                } else {
                                    counts[str].techwet = 1;
                                }
                            }



                            if (posts[i].category === 'opinieanalyse') {
                                if (counts[str].opinieanalyse) {
                                    counts[str].opinieanalyse = counts[str].opinieanalyse + 1;
                                } else {
                                    counts[str].opinieanalyse = 1;
                                }
                            }



                            if (posts[i].category === 'cultmedia') {
                                if (counts[str].cultmedia) {
                                    counts[str].cultmedia = counts[str].cultmedia + 1;
                                } else {
                                    counts[str].cultmedia = 1;
                                }
                            }



                            if (posts[i].category === 'ookdatnog') {
                                if (counts[str].ookdatnog) {
                                    counts[str].ookdatnog = counts[str].ookdatnog + 1;
                                } else {
                                    counts[str].ookdatnog = 1;
                                }
                            }


                        }
                    }
                    if (i === posts.length - 1) {

                        // Get breaking days
                        days = this.$firebaseArray(this.daysRef);
                        days.$loaded()
                            .then((x) => {


                                for (let i = 0, len = days.length; i < len; i++) {
                                    if (days[i].breaking) {
                                        let date = days[i].date;
                                        let str = date.slice(0, -2);
                                        if (!counts[str].breaking) {
                                            counts[str].breaking = [date];
                                        } else {
                                            counts[str].breaking.push(date);
                                        }
                                    }
                                    if (i === days.length - 1) {
                                        console.log('last');
                                        console.log(counts);
                                         this.overview = counts;

                                        let label = '';
                                        counts.forEach((a) => {
                                            console.log(a);
                                            label = a.month + ' ' + a.year
                                            this.labels.push(label);
                                            if (a.hard) {
                                                this.data[0].push(a.hard / a.total * 100);
                                            } else(
                                                this.data[0].push(0)
                                            )

                                            if (a.standaard) {
                                                this.data[1].push(a.standaard / a.total * 100);
                                            } else(
                                                this.data[1].push(0)
                                            )

                                            if (a.sport) {
                                                this.data[2].push(a.sport / a.total * 100);
                                            } else(
                                                this.data[2].push(0)
                                            )

                                            if (a.techwet) {
                                                this.data[3].push(a.techwet / a.total * 100);
                                            } else(
                                                this.data[3].push(0)
                                            )


                                            if (a.opinieanalyse) {
                                                this.data[4].push(a.opinieanalyse / a.total * 100);
                                            } else(
                                                this.data[4].push(0)
                                            )

                                            if (a.cultmedia) {
                                                this.data[5].push(a.cultmedia / a.total * 100);
                                            } else(
                                                this.data[5].push(0)
                                            )


                                            if (a.ookdatnog) {
                                                this.data[6].push(a.ookdatnog / a.total * 100);
                                            } else(
                                                this.data[6].push(0)
                                            )

                                        });

                                       


                                        // Add it to the chartjs


                                        this.showTotals = true;



                                    }
                                }





                            })
                            .catch((error) => {
                                console.log("Error:", error);
                            });


                    }
                }
                this.showTotals = true;

            })
            .catch((error) => {
                console.log("Error:", error);
            });



    }


    getPosts(minDate, maxDate, range) {
        this.numberOfDays = 1;

        let query = '';
        let daysQuery = '';
        if (range) {
            this.numberOfDays = maxDate - minDate + 1;
            query = this.postsRef.orderByChild('addedDate').startAt(minDate).endAt(maxDate);
        } else {
            query = this.postsRef.orderByChild('addedDate').equalTo(minDate);

        }
        this.posts = this.$firebaseArray(query);
        this.watchFirebase();
    }

    addPost(post) {
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
            // variable to count the strber of posts
            let totalPosts = 0;

            // Loop through all the posts
            for (let i = 0; i < this.posts.length; i++) {

                // Count the strber of posts
                totalPosts++;

                // If the strber of posts is bigger than the total that is permitted, the permitted total changes in the real total
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
        this.getDay(this.rewriteDate(minDate));


    }



}

GridController.$inject = ['$log', '$firebaseArray', '$firebaseObject'];
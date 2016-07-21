// TODO: refactoring that=this bullshit

export default class templaterService {
    constructor($log, $q, $http, toast, $sce, Upload) {
        this.$log = $log;
        this.$q = $q;
        this.$http = $http;
        this.toast = toast;
        this.$sce = $sce;
        this.Upload = Upload;

        this.root = 'D:\\videoTemplater\\dropbox\\';
        this.inFolder = this.root + 'in\\';
        this.aepLocation = this.root + 'ae\\Templater\\';
        this.visualsToSend = [];
        this.clipTemplates = [{
            meta: {
                'id': 'defaultSub',
                'brand': 'all',
                'type': 'sub',
                'form': '/components/subtitles/template.subtitle.normalSub.html',
                'view': '/components/subtitles/explainers.centercenter.view.html',
            },
            clip: {
                'style': 'default'

            }
        }, {
            meta: {
                'id': 'title',
                'brand': 'deredactie.be',
                'type': 'visual',
                'img': 'assets/videoTemplates/Still_title.jpg',
                'form': '/components/subtitles/template.visual.title.html',
                'view': '/components/explainers/explainers.centercenter.view.html',
                'length': 5
            },
            clip: {
                'aep': this.aepLocation + 'template.aep',
                "color1": "1B2A36",
                "color2": "4CBF23",
                "TextAmerikaKiest": "{{off}}",
                "TextDeRedactie": "{{off}}",
                "TextLow": "",
                "TextLongLow": "{{off}}",
                "TextUp": "{{off}}",
                "TextLongUp": "{{off}}",
                "Number": "{{off}}",
                "DigitNumber": "{{off}}",
                "Quote": "{{off}}",
                "QuoteName": "{{off}}",
                "Date": "{{off}}",
                "City": "{{off}}",
                "LowerThird": "{{off}}",
                "Title": "{{off}}",
                "Twitter": "{{off}}",
                "TweetHandle": "{{off}}",
                "TweetName": "{{off}}",
                "TweetProfile": "{{off}}"
            }
        }, {
            meta: {
                'id': 'bottomLeft',
                'brand': 'deredactie.be',
                'type': 'visual',
                'img': 'assets/videoTemplates/Still_title.jpg',
                'form': '/components/subtitles/template.visual.bottomLeft.html',
                'view': '/components/explainers/explainers.centercenter.view.html',
                'length': 7
            },
            clip: {
                'aep': this.aepLocation + 'Template_Text_title.aep',
            }
        }];


        this.audioTracks = [{
            'name': 'geen',
            'id': 0,
            'brand': 'deredactie.be',
            'length': 'nvt',
            'fileLocal': false,
            'fileRemote': false
        }, {
            'name': '1',
            'id': 1,
            'brand': 'deredactie.be',
            'length': '02:54',
            'fileLocal': 'assets/audio/deredactiebe/1.mp3',
            'fileRemote': this.root + 'audio\\1.wav'
        }, {
            'name': '2',
            'id': 2,
            'brand': 'deredactie.be',
            'length': '01:23',
            'fileLocal': 'assets/audio/deredactiebe/2.mp3',
            'fileRemote': this.root + 'audio\\2.wav'
        }, {
            'name': '3',
            'id': 3,
            'brand': 'deredactie.be',
            'length': '01:23',
            'fileLocal': 'assets/audio/deredactiebe/3.mp3',
            'fileRemote': this.root + 'audio\\3.wav'
        }, {
            'name': '4',
            'id': 4,
            'brand': 'deredactie.be',
            'length': '01:23',
            'fileLocal': 'assets/audio/deredactiebe/4.mp3',
            'fileRemote': this.root + 'audio\\4.wav'
        }, {
            'name': '5',
            'id': 5,
            'brand': 'deredactie.be',
            'length': '01:23',
            'fileLocal': 'assets/audio/deredactiebe/5.mp3',
            'fileRemote': this.root + 'audio\\5.wav'
        }, {
            'name': '6',
            'id': 6,
            'brand': 'deredactie.be',
            'length': '01:23',
            'fileLocal': 'assets/audio/deredactiebe/6.mp3',
            'fileRemote': this.root + 'audio\\6.wav'
        }];

        this.logos = [{
            'name': 'geen',
            'id': 0,
            'brand': 'all',
            'fileLocal': null,
            'fileServer': null,
            'fileRemote': null
        }, {
            'name': 'Deredactie.be simpel',
            'id': 1,
            'brand': ['deredactie.be', 'amerika kiest'],
            'fileLocal': 'assets/logos/deredactie_1.gif',
            'fileServer': 'assets/logos/deredactie_1.mov',
            'fileRemote': this.root + 'logos\\deredactie_1.mov'
        }];


        this.bumpers = [{
            'name': 'geen',
            'id': 0,
            'brand': 'all',
            'fileLocal': null,
            'fileRemote': null
        }, {
            'name': 'Deredactie.be simpel',
            'id': 1,
            'brand': ['deredactie.be', 'amerika kiest'],
            'fileLocal': 'assets/bumpers/deredactie_1.gif',
            'fileServer': 'assets/bumpers/deredactie_1.mov',
            'fileRemote': this.root + 'bumpers\\deredactie_1.mov',
            'fade': 2,
            'bumperLength': 4
        }, {
            'name': 'Amerika Kiest',
            'id': 2,
            'brand': 'amerika kiest',
            'fileLocal': 'assets/bumpers/amerikakiest_1.gif',
            'fileServer': 'assets/bumpers/amerikakiest_1.mov',
            'fileRemote': this.root + 'bumpers\\amerikakiest_1.mov',
            'fade': 2,
            'bumperLength': 4
        }, {
            'name': 'Een Blauw',
            'id': 3,
            'brand': 'een',
            'fileLocal': 'assets/bumpers/een_1.gif',
            'fileServer': 'assets/bumpers/een_1.mov',
            'fileRemote': this.root + 'bumpers\\een_1.mov',
            'fade': 1,
            'bumperLength': 5
        }, {
            'name': 'Een Geel',
            'id': 4,
            'brand': 'een',
            'fileLocal': 'assets/bumpers/een_2.gif',
            'fileServer': 'assets/bumpers/een_2.mov',
            'fileRemote': this.root + 'bumpers\\een_2.mov',
            'fade': 1,
            'bumperLength': 5
        }, {
            'name': 'Een Groen',
            'id': 5,
            'brand': 'een',
            'fileLocal': 'assets/bumpers/een_3.gif',
            'fileServer': 'assets/bumpers/een_3.mov',
            'fileRemote': this.root + 'bumpers\\een_3.mov',
            'fade': 1,
            'bumperLength': 5
        }, {
            'name': 'Een Rood',
            'id': 6,
            'brand': 'een',
            'fileLocal': 'assets/bumpers/een_4.gif',
            'fileServer': 'assets/bumpers/een_4.mov',
            'fileRemote': this.root + 'bumpers\\een_4.mov',
            'fade': 1,
            'bumperLength': 5
        }, {
            'name': 'Een Roze',
            'id': 7,
            'brand': 'een',
            'fileLocal': 'assets/bumpers/een_5.gif',
            'fileServer': 'assets/bumpers/een_5.mov',
            'fileRemote': this.root + 'bumpers\\een_5.mov',
            'fade': 1,
            'bumperLength': 5
        }, ];
    }


    /*

        __  __     __                   ______                 __  _
       / / / /__  / /___  ___  _____   / ____/_  ______  _____/ /_(_)___  ____  _____
      / /_/ / _ \/ / __ \/ _ \/ ___/  / /_  / / / / __ \/ ___/ __/ / __ \/ __ \/ ___/
     / __  /  __/ / /_/ /  __/ /     / __/ / /_/ / / / / /__/ /_/ / /_/ / / / (__  )
    /_/ /_/\___/_/ .___/\___/_/     /_/    \__,_/_/ /_/\___/\__/_/\____/_/ /_/____/
                /_/

    */



    time() {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let hours = today.getHours();
        let minutes = today.getMinutes();
        let seconds = today.getSeconds();
        let yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        let date = yyyy + mm + dd + '_' + hours + minutes + seconds;
        return date;
    }


    msToTime(millis) {
        var dur = {};
        millis = millis * 1000;

        var units = [
            { label: 'millis', mod: 1000 },
            { label: 'seconds', mod: 60 },
            { label: 'minutes', mod: 60 },
            { label: 'hours', mod: 24 },
        ];
        // calculate the individual unit values...
        units.forEach(function(u) {
            millis = (millis - (dur[u.label] = (millis % u.mod))) / u.mod;
        });

        let twoDigits = function(number) {
            if (number < 10) {
                number = '0' + number;
                return number;
            } else {
                return number;
            }
        };

        let round = function(number) {

            if (number < 99) {
                return number;

            } else {
                number = Math.round((number / 10));
                return number;
            }
        };
        let time = dur.hours + ':' + twoDigits(dur.minutes) + ':' + twoDigits(dur.seconds) + '.' + round(dur.millis);
        return time;
    }



    /*

        ___    ______   ________  ___   ______________________  _   _______
       /   |  / ____/  / ____/ / / / | / / ____/_  __/  _/ __ \/ | / / ___/
      / /| | / __/    / /_  / / / /  |/ / /     / /  / // / / /  |/ /\__ \
     / ___ |/ /___   / __/ / /_/ / /|  / /___  / / _/ // /_/ / /|  /___/ /
    /_/  |_/_____/  /_/    \____/_/ |_/\____/ /_/ /___/\____/_/ |_//____/


    */


    // addAudio(ffmpeg, audio, project, state) {
    //     const deferred = this.$q.defer();
    //     const folder = this.root + 'out\\' + project + '\\';
    //     if (audio > 0) {
    //         ffmpeg = ffmpeg + ' && ffmpeg -i ' + folder + project + state + '.mp4' + ' ' + folder + project + '_audioTrack.mp3 && ffmpeg -i ' + folder + project + 'audioTrack.mp3 -i ' + this.audioTracks[audio].fileRemote + ' -filter_complex amerge -c:a libmp3lame -q:a 4 ' + folder + project + 'audioMix.mp3 && ffmpeg -i ' + folder + project + state + '.mp4' + ' -i ' + folder + project + 'audioMix.mp3 -c:v copy -c:a aac -strict experimental -map 0:v:0 -map 1:a:0 ' + folder + project + state + '_audio.mp4';
    //         state = state + '_bumper';
    //         let resp = {
    //             ffmpeg: ffmpeg,
    //             state: state
    //         };
    //         deferred.resolve(resp);
    //     } else {
    //         let resp = {
    //             ffmpeg: ffmpeg,
    //             state: state
    //         };
    //         deferred.resolve(resp);
    //     }
    //     return deferred.promise;
    // }

    // addLogo(ffmpeg, logo, project, state) {
    //     const deferred = this.$q.defer();
    //     const folder = this.root + 'out\\' + project + '\\';
    //     console.log(logo);
    //     if (logo > 0) {
    //         ffmpeg = ffmpeg + ' && ffmpeg -i ' + folder + project + '_clean.mp4' + ' -i ' + this.logos[logo].fileRemote + ' -filter_complex overlay=10:10 ' + folder + project + state + '_logo.mp4';
    //         state = state + '_logo';
    //         let resp = {
    //             ffmpeg: ffmpeg,
    //             state: state
    //         };
    //         deferred.resolve(resp);

    //     } else {
    //         let resp = {
    //             ffmpeg: ffmpeg,
    //             state: state
    //         };
    //         deferred.resolve(resp);
    //     }
    //     return deferred.promise;
    // }

    // addBumper(ffmpeg, bumper, duration, project, state) {
    //     const deferred = this.$q.defer();
    //     const folder = this.root + 'out\\' + project + '\\';
    //     if (bumper > 0) {
    //         ffmpeg = ffmpeg + ' && ffmpeg -i ' + folder + project + state + '.mp4' + ' -i ' + this.bumpers[bumper].fileRemote + ' -filter_complex \"\"color=black:1920x1080:d=' + duration + '[base];[0:v]setpts=PTS-STARTPTS[v0];[1:v]format=yuva420p,setpts=PTS-STARTPTS+((' + (duration - this.bumpers[bumper].fade) + ')/TB)[v1];[base][v0]overlay[tmp];[tmp][v1]overlay,format=yuv420p[fv]\"\" -map [fv] -c copy -c:v libx264 -b:v 1000k ' + folder + project + state + '_bumper.mp4';
    //         state = state + '_bumper';
    //         let resp = {
    //             ffmpeg: ffmpeg,
    //             state: state
    //         };
    //         deferred.resolve(resp);
    //     } else {
    //         let resp = {
    //             ffmpeg: ffmpeg,
    //             state: state
    //         };
    //         deferred.resolve(resp);
    //     }
    //     return deferred.promise;
    // }

    // overlays(clips, meta, project) {
    //     const deferred = this.$q.defer();
    //     const folder = this.root + 'out\\' + project + '\\';
    //     let state = '';
    //     let resp = '';
    //     let ffmpeg = '';
    //     let clipsToOverlay = '';
    //     let clipsTiming = '';
    //     let clipOverlaying = '';
    //     angular.forEach(clips, (clip) => {
    //         let clipId = parseInt(clip.id);
    //         let clipMinusOne = clipId - 1;
    //         let total = parseInt(clips.length);
    //         clipsToOverlay = clipsToOverlay + ' -i ' + folder + 'clips\\' + clip.id + '.mov';
    //         clipsTiming = clipsTiming + '[' + clip.id + ':v]setpts=PTS-STARTPTS+' + clip.start + '/TB[v' + clipId + '];';
    //         clipOverlaying = clipOverlaying + ';[c' + clipMinusOne + '][v' + clipId + ']overlay=eof_action=pass[c' + clipId + ']';
    //         if (clipId === total) {

    //             ffmpeg = 'ffmpeg -i ' + meta.movieUrl + clipsToOverlay + ' -filter_complex \"\"[0:v]setpts=PTS-STARTPTS[v0];' + clipsTiming + '[v0]scale=1920:1080 [c0]' + clipOverlaying + '\"\" -map [c' + clipId + '] -map 0:1? ' + folder + project + '_clean.mp4';
    //             state = '_clean';
    //             resp = {
    //                 ffmpeg: ffmpeg,
    //                 state: '_clean'
    //             };
    //             deferred.resolve(resp);
    //         }
    //     });
    //     return deferred.promise;
    // }


    overlays(clips, meta, project, subs) {
        console.log('creating FFMPEGline');

        const deferred = this.$q.defer();
        const folder = this.root + 'out\\' + project + '\\';
        const subsFolder = this.root + 'subs\\' + project + '.ass';

        let input = ' -i ' + meta.movieUrl;
        let clipsTiming = '';
        let clipOverlaying = '';
        let overlayCommand = '';
        let bumperCommand = '';
        let logoCommand = '';
        let audioCommand = '';
        let subsCommand = '';
        let totalDuration = '';
        let ffmpegCommand = '';
        let res = {};


console.log('going into clips loop');
        for (var key in clips) {
            if (!clips.hasOwnProperty(key)) continue;

            let clip = clips[key];
            let clipId = parseInt(clip.id);
            let clipMinusOne = clipId - 1;
            let clipPlusOne = clipId + 1;
            let clipPlusTwo = clipId + 2;
            let clipPlusThree = clipId + 3;
            let totalClips = parseInt(clips.length);


            // Input Original Movie

            // Input Overlays
            input = input + ' -i ' + folder + 'clips\\' + clip.id + '.mov';

            // Create the overlay command
            clipsTiming = clipsTiming + '[' + clip.id + ':v]setpts=PTS-STARTPTS+' + clip.start + '/TB[v' + clipId + '];';
            if(clip.id === 1){
                clipOverlaying = clipOverlaying + '[0:v][v' + clipId + ']overlay=eof_action=pass[c' + clipId + '];';
            } else {
                clipOverlaying = clipOverlaying + '[c' + clipMinusOne + '][v' + clipId + ']overlay=eof_action=pass[c' + clipId + '];';
            }


            console.log('going into last one');
            console.log(clip.id === totalClips, key, totalClips);
            if (clip.id === totalClips) {
                console.log('last one');


                if (meta.bumper > 0) {
                    totalDuration = meta.movieDuration + this.bumpers[meta.bumper].bumperLength - this.bumpers[meta.bumper].fade;
                    input = input + ' i- '+ this.bumpers[meta.bumper].fileRemote+' -f lavfi -i color=c=black:s=' + meta.movieWidth + 'x' + meta.movieHeight;

                    if (meta.logo > 0) {
                        bumperCommand = '[' + clipPlusOne + ':v]scale=' + meta.movieWidth + ':-1[bumperRescaled];[' + clipPlusTwo + ':v]scale=' + meta.movieWidth + 'x' + meta.movieHeight + ',trim=duration=' + totalDuration + '[blackVideo];[bumperRescaled]format=yuva420p,setpts=PTS-STARTPTS+((13.337)/TB)[theBumper];[blackVideo][c' + clipId + ']overlay=x=0:y=0[longMovie];[longMovie][theBumper]overlay=x=0:y=0[longMovieBumper];';
                    } else {
                        bumperCommand = '[' + clipPlusOne + ':v]scale=' + meta.movieWidth + ':-1[bumperRescaled];[' + clipPlusTwo + ':v]scale=' + meta.movieWidth + 'x' + meta.movieHeight + ',trim=duration=' + totalDuration + '[blackVideo];[bumperRescaled]format=yuva420p,setpts=PTS-STARTPTS+((13.337)/TB)[theBumper];[blackVideo][c' + clipId + ']overlay=x=0:y=0[endMovie];[longMovie][theBumper]overlay=x=0:y=0[endMovie];';
                    }
                }

                if (meta.logo > 0 && meta.bumper === 0) {
                    input = input + ' -i ' + this.logos[meta.logo].fileRemote;
                    logoCommand = '[' + clipPlusOne + ']scale=' + meta.movieWidth / 6 + ':-1[logoRescaled];[c' + clipId + '][logoRescaled]overlay=x=10:y=10[endMovie];';
                } else if (meta.logo > 0 && meta.bumper > 0) {
                    input = input + ' -i ' + this.logos[meta.logo].fileRemote;
                    logoCommand = '[' + clipPlusThree + ':v]scale=' + meta.movieWidth / 6 + ':-1[logoRescaled];[longMovieBumper][logoRescaled]overlay=x=10:y=10[endMovie];';
                }

                if (meta.audio > 0) {
                    audioCommand = 'amix=inputs=2:duration=first:dropout_transition=3;';
                } else {
                    audioCommand = 'amix=inputs=1:duration=first:dropout_transition=3;';
                }

                if (subs.length > 0) {
                    subsCommand = '[endMovie]ass=' + subsFolder + '[out]';
                    ffmpegCommand = 'ffmpeg' + input + ' -y -filter_complex \"\"' + clipsTiming + clipOverlaying + bumperCommand + logoCommand + audioCommand + subsCommand + '\"\" -map [out] -strict -2 ' + folder + project + '.mp4';
                } else {
                    ffmpegCommand = 'ffmpeg' + input + ' -y -filter_complex \"\"' + clipsTiming + clipOverlaying + bumperCommand + logoCommand + audioCommand;

                }
                console.log(ffmpegCommand);

                res = {
                    ffmpeg: ffmpegCommand
                };
                 deferred.resolve(res);


            }
        }
        return deferred.promise;
    }






    sendToAfterEffects(clips) {
        let params = {
            movieClips: clips
        };
        this.$http.post('api/movie/update-movie-json', params)
            .then(() => {
                console.log('send');
                this.toast.showToast('success', 'Uw video wordt zodra verwerkt, het resultaat wordt naar u doorgemailed.');
            });
    }



    // sesdtAttributes() {
    //     clip = clipAttributes;
    //     clip.id = key++;


    //     clip['render-status'] = 'ready';
    //     clip.bot = 'render';
    //     clip.last = 'false';
    //     clip.module = 'jpg2000';

    //     clip.email = meta.email;
    //     clip.output = project + '/clips/' + key++;

    //     clip.TextDeRedactie = originalClip.text;
    //     clip.start = originalClip.start;
    //     readyClips.push(clip);
    //     // this is the last one
    //     console.log('This is the last one?', key++ === visuals.length);
    //     if (key++ === visuals.length) {
    //         // Add attributes specific for the last one
    //         clip.last = true;
    //         // Create the ffmpegline
    //         this.overlays(readyClips, meta, project, subs).then((resp) => {
    //             ffmpeg = resp.ffmpeg;
    //             clip.ffmpeg = ffmpeg;
    //             console.log(ffmpeg);
    //             deferred.resolve(readyClips);


    //             // state = resp.state;

    //             // // Logo, bumper etc aren't variable now, just true or false
    //             // this.addLogo(ffmpeg, meta.logo, project, state).then((resp) => {
    //             //     ffmpeg = resp.ffmpeg;
    //             //     state = resp.state;
    //             //     this.addBumper(ffmpeg, meta.bumper, meta.movieDuration, project, state).then((resp) => {
    //             //         ffmpeg = resp.ffmpeg;
    //             //         state = resp.state;
    //             //         this.addAudio(ffmpeg, meta.audio, project, state).then((resp) => {
    //             //             clip.ffmpeg = ffmpeg;
    //             //             console.log('done with creating clips');
    //             //             deferred.resolve(readyClips);
    //             //         });
    //             //     });
    //             // });
    //         });
    //     }


    // }



    setClipAttributes(originalClip, key, project, email) {
        for (let i = 0; i < this.clipTemplates.length; i++) {
            if (this.clipTemplates[i].meta.id === originalClip.template) {
                let clip = {};
                clip = this.clipTemplates[i].clip;
                clip.id = key++;
                clip['render-status'] = 'ready';
                clip.bot = 'render';
                clip.last = 'false';
                clip.module = 'jpg2000';
                clip.email = email;
                clip.output = project + '/clips/' + key++;
                console.log(originalClip.text);
                clip.TextDeRedactie = originalClip.text;
                console.log(clip.TextDeRedactie);
                clip.start = originalClip.start;
                console.log(clip);
                return clip;
            }
        }
    }


    visualsToJSON(visuals, subs, meta, project) {

        const deferred = this.$q.defer();
        if (visuals.length > 0) {

            let ffmpeg = '';
            let newClips = [];
            let template = '';

            for (var x = 0, ln = visuals.length; x < ln; x++) {

                template = visuals[x].template;
                let clip = [];
                let attributes = {};
                attributes = this.clipTemplates[template].clip;
                for (var key in attributes) {
                    if (!attributes.hasOwnProperty(key)) continue;
                    clip[key] = attributes[key];
                }

                clip['render-status'] = 'ready';
                clip.bot = 'render';
                clip.last = 'false';
                clip.module = 'jpg2000';
                clip.email = meta.email;
                clip.output = project + '/clips/' + x + 1;
                clip.id = x + 1;
                clip.start = visuals[x].start;
                clip.TextDeRedactie = visuals[x].text;

                if (visuals.length === x + 1) {
                    clip.last = true;
                    newClips.push(clip);
                    this.overlays(newClips, meta, project, subs).then((resp) => {
                        ffmpeg = resp.ffmpeg;
                        clip.ffmpeg = ffmpeg;
                        console.log(ffmpeg);
                        newClips.push(clip);
                        deferred.resolve(newClips);
                    });
                } else {
                    newClips.push(clip);
                }
            }
        } else {
            deferred.resolve();
        }
        return deferred.promise;
    }


    /*

       _____ __  _ __       __                 ______                 __  _
      / ___// /_(_) /______/ /_  ___  _____   / ____/_  ______  _____/ /_(_)___  ____  _____
      \__ \/ __/ / __/ ___/ __ \/ _ \/ ___/  / /_  / / / / __ \/ ___/ __/ / __ \/ __ \/ ___/
     ___/ / /_/ / /_/ /__/ / / /  __/ /     / __/ / /_/ / / / / /__/ /_/ / /_/ / / / (__  )
    /____/\__/_/\__/\___/_/ /_/\___/_/     /_/    \__,_/_/ /_/\___/\__/_/\____/_/ /_/____/


    */

    stitcher(clips) {
        const deferred = this.$q.defer();
        const folder = this.root + 'out\\' + project + '\\';
        const fin = this.root + 'finished\\' + this.movieId + '.mp4';
        const input = this.inFolder + this.clips[0].movieName;

        let ffmpegLine = '';
        let total = parseInt(clips.length);
        let clipsToConcat = '';
        let listClips = '';

        angular.forEach(clips, (clip) => {
            let clipId = parseInt(clip.id);
            let clipMinusOne = clipId - 1;

            clipsToConcat = clipsToConcat + ' -i ' + this.inFolder + clip.id + '.avi';

            listClips = listClips + '[' + clipMinusOne + '] ';
            if (clipId === total) {
                ffmpegLine = 'ffmpeg' + clipsToConcat + ' -filter_complex \"\"' + listClips + 'concat=n=' + total + ':v=1[out]\"\" -map [out] ' + folder + project + '_clean.mp4';
                deferred.resolve(ffmpegLine);
            } else {
                let resp = {
                    ffmpeg: ffmpeg,
                    state: state
                };
                deferred.resolve(resp);
            }
        });
        return deferred.promise;
    }



    /*

           _____       __    __  _ __  __        ______                 __  _
          / ___/__  __/ /_  / /_(_) /_/ /__     / ____/_  ______  _____/ /_(_)___  ____  _____
          \__ \/ / / / __ \/ __/ / __/ / _ \   / /_  / / / / __ \/ ___/ __/ / __ \/ __ \/ ___/
         ___/ / /_/ / /_/ / /_/ / /_/ /  __/  / __/ / /_/ / / / / /__/ /_/ / /_/ / / / (__  )
        /____/\__,_/_.___/\__/_/\__/_/\___/  /_/    \__,_/_/ /_/\___/\__/_/\____/_/ /_/____/



    */

    // Upload the ASS to server (if no visuals)
    uploadSubFileToServer(file, fileName, email) {
        const deferred = this.$q.defer();
        this.Upload.upload({
                url: 'api/movie/generateSub',
                data: { file: file, fileName: fileName, email: email },
                method: 'POST',
            })
            .then((res) => {
                if (!res) return;
                deferred.resolve(res);
            }, (err) => {
                deferred.reject(err);
                console.log('Error: ' + err.error);
                console.log('Error status: ' + err.status);
            }, (evt) => {
                // this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        return deferred.promise;
    }

    // Upload the ASS to dropbox (if visuals)
    // uploadSubFileToDropbox(file, name) {
    //     console.log(file, name);
    //     const deferred = this.$q.defer();
    //     this.Upload.upload({
    //             url: 'api/movie/subToDropbox',
    //             data: { file: file, fileName: name },
    //             method: 'POST',
    //         })
    //         .then((res) => {
    //             if (!res) return;
    //             deferred.resolve(res);
    //         }, (err) => {
    //             deferred.reject(err);
    //             console.log('Error: ' + JSON.stringify(err));
    //         }, (evt) => {
    //             // this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
    //         });
    //     return deferred.promise;
    // }



    CreateSubFile(subs, email, projectId) {
        const deferred = this.$q.defer();
        if (subs) {
            let fileName = projectId + '.ass';

            let string = '';
            string = '[Script Info]\nTitle: Nieuwshub subtitles\nScriptType: v4.00\nCollisions: Normal\n\n';
            string = string + '[V4 Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n';
            string = string + 'Style: Default,arial,24,&H00FFFFFF,,&H00000000,,0,0,0,0,100,100,0,0,1,1,0,2,5,5,30,1\n\n';
            string = string + '[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n';
            angular.forEach(subs, (line) => {
                if (line.text !== undefined) {
                    let text = line.text
                    if (text.indexOf('\n') > -1) {
                        text = text.replace(/\n/g, '\\N');
                    }
                    // return $sce.trustAsHtml(text);
                    string = string + 'Dialogue: 0,' + this.msToTime(line.start) + ',' + this.msToTime(line.end) + ',Default,,0,0,0,,' + text + '\n';
                }
            });

            let file = new Blob([string], {
                type: 'ass'
            });

            console.log('starting upload');
            this.uploadSubFileToServer(file, fileName, email).then((res) => {
                console.log('done with subs');
                deferred.resolve(res);


            })

            // this.uploadSubFileToDropbox(file, assFileName).then((res) => {
            //     console.log(res);
            //     // deferred.resolve(file);
            // });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    }

    /*

       ______                __                             _           __     ______                 __  _
      / ____/_______  ____ _/ /____     ____  _________    (_)__  _____/ /_   / ____/_  ______  _____/ /_(_)___  ____  _____
     / /   / ___/ _ \/ __ `/ __/ _ \   / __ \/ ___/ __ \  / / _ \/ ___/ __/  / /_  / / / / __ \/ ___/ __/ / __ \/ __ \/ ___/
    / /___/ /  /  __/ /_/ / /_/  __/  / /_/ / /  / /_/ / / /  __/ /__/ /_   / __/ / /_/ / / / / /__/ /_/ / /_/ / / / (__  )
    \____/_/   \___/\__,_/\__/\___/  / .___/_/   \____/_/ /\___/\___/\__/  /_/    \__,_/_/ /_/\___/\__/_/\____/_/ /_/____/
                                    /_/              /___/

    */

    getAssets(meta) {
        const deferred = this.$q.defer();
        let fade = 0;
        let bumperLength = '';
        let logo, audio, bumper;

        if (meta.logo > 0) {
            logo = this.logos[meta.logo].fileServer;
        } else { logo = false };
        if (meta.audio !== false) {
            audio = this.audioTracks[meta.audio].fileLocal;
        } else {
            audio = false;
        }
        if (meta.bumper > 0) {
            fade = this.bumpers[meta.bumper].fade;
            bumperLength = this.bumpers[meta.bumper].bumperLength;
            bumper = this.bumpers[meta.bumper].fileServer;
        } else { meta.bumper = false };
        let assets = {
            fade: fade,
            bumperLength: bumperLength,
            logo: logo,
            audio: audio,
            bumper: bumper
        }
        console.log('done with getting assets');
        deferred.resolve(assets);
        return deferred.promise;
    }


    renderMovie(subs, visuals, meta, projectId) {
        const deferred = this.$q.defer();
        console.log('subs:', subs);
        console.log('visuals:', visuals);
        console.log('meta:', meta);
        console.log('projectId:', projectId);
        let uniqueProjectName = this.time() + '_' + (meta.email.substring(0, meta.email.indexOf("@"))).replace('.', '');
        let videoName = uniqueProjectName + '.mp4';


        this.$q.all([
            this.getAssets(meta),
            this.CreateSubFile(subs, meta.email, uniqueProjectName),
            this.visualsToJSON(visuals, subs, meta, uniqueProjectName),

        ]).then((value) => {
            console.log('done with everything');
            let assets = value[0];
            let assFile = value[1];
            let visualClips = value[2];

            console.log(visualClips, assFile);

            if (!visualClips && assFile) {
                console.log('There are no visual clips, and there are subs, so just burn the subs on the server');

                this.$http({
                    data: { ass: assFile.data.url, email: meta.email, videoName: videoName, movie: meta.movieUrl, duration: meta.movieDuration, width: meta.movieWidth, height: meta.movieHeight, logo: assets.logo, audio: assets.audio, bumper: assets.bumper, fade: assets.fade, bumperLength: assets.bumperLength, project: projectId, visualClips: visualClips },
                    method: 'POST',
                    url: '/api/movie/burnSubs/'
                }).then((res) => {
                    console.log(res);
                    deferred.resolve(res);
                }, (err) => {
                    deferred.reject(res);
                    console.error('Error', err);
                });
            } else if (visualClips && !assFile) {
                console.log('There are visual clips but no subs, so send the complete ffmpeg line to the templater pc');
                this.sendToAfterEffects(visualClips)

            } else if (visualClips && assFile) {



                this.sendToAfterEffects(visualClips)

            } else {
                console.log('there is nothing, chillax');
            }
        }, function(error) {
            console.log(error);
        });
        return deferred.promise;
    }





}

templaterService.$inject = ['$log', '$q', '$http', 'toast', '$sce', 'Upload'];

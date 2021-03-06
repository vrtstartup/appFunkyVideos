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
        this.rootSub = 'D\\\\:/videoTemplater/dropbox/subs/';
        this.inFolder = this.root + 'in\\';
        this.aepLocation = this.root + 'ae\\Templater\\';
        this.visualsToSend = [];

        this.clipTemplates = [{
                meta: {
                    'id': 'defaultSub',
                    'brand': 'all',
                    'excludeBrand': 'stubru',
                    'type': 'sub',
                    'img': 'assets/videoTemplates/dr_defaultSub.png',
                    'view': '/components/subtitles/views/template.subtitle.normalSub.view.html',
                    'roles': ['0', '1', '2', '']
                },
                clip: {
                    'style': 'Default',
                    'text': ""
                },
                input: {
                    'text': "",
                }
            },
            {
                meta: {
                    'id': 'title',
                    'brand': 'deredactie.be',
                    'excludeBrand': '',
                    'type': 'visual',
                    'img': 'assets/videoTemplates/dr_title.gif',
                    'view': '/components/subtitles/views/template.visual.title.view.html',
                    'length': 8,
                    'roles': ['0', '1']
                },
                clip: {
                    'aep': this.aepLocation + 'template.aep',
                    "color1": "1B2A36",
                    "color2": "4CBF23",
                    "Text1": "{{off}}",
                    "LowText": "{{off}}",
                    "HighText": "{{off}}",
                    "BigText": "",
                    "HighlightText": "{{off}}",
                    "Text1": "",
                    "Text2DR": "",
                    "Text2AK": "{{off}}",
                    "Text4AK": "{{off}}",
                    "Text5": ""
                },
                input: {
                    "Text2DR": "",
                    "Text1": "",
                }
            },

            {
                meta: {
                    'id': 'topLeft',
                    'brand': 'deredactie.be',
                    'excludeBrand': '',
                    'type': 'visual',
                    'img': 'assets/videoTemplates/dr_high.gif',
                    'view': '/components/subtitles/views/template.visual.topLeft.view.html',
                    'length': 8,
                    'roles': ['0', '1']
                },
                clip: {
                    'aep': this.aepLocation + 'template.aep',
                    "color1": "1B2A36",
                    "color2": "4CBF23",
                    "Text1": "{{off}}",
                    "LowText": "{{off}}",
                    "HighText": "",
                    "BigText": "{{off}}",
                    "HighlightText": "{{off}}",
                    "Text1": "{{off}}",
                    "Text2DR": "",
                    "Text2AK": "{{off}}",
                    "Text4AK": "{{off}}",
                    "Text5": ""
                },
                input: {
                    "Text2DR": "",
                }
            },

            {
                meta: {
                    'id': 'bottomLeft',
                    'brand': 'deredactie.be',
                    'excludeBrand': '',
                    'type': 'visual',
                    'img': 'assets/videoTemplates/dr_low.gif',
                    'view': '/components/subtitles/views/template.visual.bottomLeft.view.html',
                    'length': 8,
                    'roles': ['0', '1']
                },
                clip: {
                    'aep': this.aepLocation + 'template.aep',
                    "color1": "1B2A36",
                    "color2": "4CBF23",
                    "Text1": "{{off}}",
                    "LowText": "",
                    "HighText": "{{off}}",
                    "BigText": "{{off}}",
                    "HighlightText": "{{off}}",
                    "Text1": "{{off}}",
                    "Text2DR": "",
                    "Text2AK": "{{off}}",
                    "Text4AK": "{{off}}",
                    "Text5": ""
                },
                input: {
                    "Text2DR": "",
                }
            }, {
                meta: {
                    'id': 'stubruSub',
                    'brand': 'stubru',
                    'excludeBrand': '',
                    'type': 'sub',
                    'img': 'assets/videoTemplates/stubru_defaultSub.png',
                    'view': '/components/subtitles/views/template.subtitle.stubruDefaultSub.view.html',
                    'roles': ['0', '1', '2']
                },
                clip: {
                    'style': 'StubruDefault',
                    'text': ""

                }
            }, {
                meta: {
                    'id': 'deredactieBackdrop',
                    'brand': 'deredactie.be',
                    'excludeBrand': '',
                    'type': 'sub',
                    'img': 'assets/videoTemplates/dr_backDropSub.png',
                    'view': '/components/subtitles/views/template.subtitle.backDropSub.view.html',
                    'roles': ['0', '1', '2', '']
                },
                clip: {
                    'style': 'DeredactieBackdrop',
                    'text': ""
                },
                input: {
                    'text': "",
                }
            }, {
                meta: {
                    'id': 'title',
                    'brand': 'canvas',
                    'excludeBrand': '',
                    'type': 'visual',
                    'img': 'assets/videoTemplates/dr_title.gif',
                    'view': '/components/subtitles/views/template.visual.title.view.html',
                    'length': 8,
                    'roles': ['0', '1']
                },
                clip: {
                    'aep': this.aepLocation + 'template.aep',
                    "color1": "1B2A36",
                    "color2": "FF8100",
                    "Text1": "{{off}}",
                    "LowText": "{{off}}",
                    "HighText": "{{off}}",
                    "BigText": "",
                    "HighlightText": "{{off}}",
                    "Text1": "",
                    "Text2DR": "",
                    "Text2AK": "{{off}}",
                    "Text4AK": "{{off}}",
                    "Text5": ""
                },
                input: {
                    "Text2DR": "",
                    "Text1": "",
                }
            }, {
                meta: {
                    'id': 'topLeft',
                    'brand': 'canvas',
                    'excludeBrand': '',
                    'type': 'visual',
                    'img': 'assets/videoTemplates/dr_high.gif',
                    'view': '/components/subtitles/views/template.visual.topLeft.view.html',
                    'length': 8,
                    'roles': ['0', '1']
                },
                clip: {
                    'aep': this.aepLocation + 'template.aep',
                    "color1": "1B2A36",
                    "color2": "FF8100",
                    "Text1": "{{off}}",
                    "LowText": "{{off}}",
                    "HighText": "",
                    "BigText": "{{off}}",
                    "HighlightText": "{{off}}",
                    "Text1": "{{off}}",
                    "Text2DR": "",
                    "Text2AK": "{{off}}",
                    "Text4AK": "{{off}}",
                    "Text5": ""
                },
                input: {
                    "Text2DR": "",
                }
            }, {
                meta: {
                    'id': 'bottomLeft',
                    'brand': 'canvas',
                    'excludeBrand': '',
                    'type': 'visual',
                    'img': 'assets/videoTemplates/dr_low.gif',
                    'view': '/components/subtitles/views/template.visual.bottomLeft.view.html',
                    'length': 8,
                    'roles': ['0', '1']
                },
                clip: {
                    'aep': this.aepLocation + 'template.aep',
                    "color1": "1B2A36",
                    "color2": "FF8100",
                    "Text1": "{{off}}",
                    "LowText": "",
                    "HighText": "{{off}}",
                    "BigText": "{{off}}",
                    "HighlightText": "{{off}}",
                    "Text1": "{{off}}",
                    "Text2DR": "",
                    "Text2AK": "{{off}}",
                    "Text4AK": "{{off}}",
                    "Text5": ""
                },
                input: {
                    "Text2DR": "",
                    "Text5": ""
                }
            }, {
                meta: {
                    'id': 'deredactieExplainerTop',
                    'brand': 'deredactie.be',
                    'excludeBrand': '',
                    'type': 'sub',
                    'img': 'assets/videoTemplates/dr_backDropSub.png',
                    'view': '/components/subtitles/views/template.subtitle.backDropSub.view.html',
                    'roles': ['0', '1']
                },
                clip: {
                    'style': 'DeredactieExplainerTop',
                    'text': ""
                },
                input: {
                    'text': "",
                }
            }, {
                meta: {
                    'id': 'deredactieExplainerBottom',
                    'brand': 'deredactie.be',
                    'excludeBrand': '',
                    'type': 'sub',
                    'img': 'assets/videoTemplates/dr_backDropSub.png',
                    'view': '/components/subtitles/views/template.subtitle.backDropSub.view.html',
                    'roles': ['0', '1']
                },
                clip: {
                    'style': 'DeredactieExplainerBottom',
                    'text': ""
                },
                input: {
                    'text': "",
                }
            }, {
                meta: {
                    'id': 'deredactieExplainerBottomLeft',
                    'brand': 'deredactie.be',
                    'excludeBrand': '',
                    'type': 'sub',
                    'img': 'assets/videoTemplates/dr_backDropSub.png',
                    'view': '/components/subtitles/views/template.subtitle.backDropSub.view.html',
                    'roles': ['0', '1']
                },
                clip: {
                    'style': 'DeredactieExplainerBottomLeft',
                    'text': ""
                },
                input: {
                    'text': "",
                }
            }, {
                meta: {
                    'id': 'deredactieExplainerTopLeft',
                    'brand': 'deredactie.be',
                    'excludeBrand': '',
                    'type': 'sub',
                    'img': 'assets/videoTemplates/dr_backDropSub.png',
                    'view': '/components/subtitles/views/template.subtitle.backDropSub.view.html',
                    'roles': ['0', '1']
                },
                clip: {
                    'style': 'DeredactieExplainerTopLeft',
                    'text': ""
                },
                input: {
                    'text': "",
                }
            }


        ];

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
            'fileServer': null,
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
        }, {
            'name': 'Terzake 1',
            'id': 8,
            'brand': 'canvas',
            'fileLocal': 'assets/bumpers/terzake_3.gif',
            'fileServer': 'assets/bumpers/terzake_3.mov',
            'fileRemote': this.root + 'bumpers\\terzake_3.mov',
            'fade': 0,
            'bumperLength': 5,
            'audio': true

        }, {
            'name': 'Sporza 1',
            'id': 9,
            'brand': 'sporza',
            'fileLocal': 'assets/bumpers/sporza_1.gif',
            'fileServer': 'assets/bumpers/sporza_1.mov',
            'fileRemote': this.root + 'bumpers\\sporza_1.mov',
            'fade': 0,
            'bumperLength': 2
        }, {
            'name': 'De Afspraak 1',
            'id': 10,
            'brand': 'canvas',
            'fileLocal': 'assets/bumpers/deafspraak1.gif',
            'fileServer': 'assets/bumpers/deafspraak_1.mov',
            'fileRemote': this.root + 'bumpers\\deafspraak_1.mov',
            'fade': 1,
            'bumperLength': 4
        }, {
            'name': 'De Afspraak 2',
            'id': 11,
            'brand': 'canvas',
            'fileLocal': 'assets/bumpers/deafspraak2.gif',
            'fileServer': 'assets/bumpers/deafspraak_2.mov',
            'fileRemote': this.root + 'bumpers\\deafspraak_2.mov',
            'fade': 0,
            'bumperLength': 4
        }];
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
        let date = yyyy.toString() + mm.toString() + dd.toString() + '_' + hours.toString() + minutes.toString() + seconds.toString();
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
                return '0' + Math.round((number / 10));



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

    overlays(clips, meta, project, subs) {

        const deferred = this.$q.defer();
        const folder = this.root + 'out\\' + project + '\\';
        const subsFolder = this.rootSub + project + '.ass';

        let input = ' -i ' + meta.movieUrl;
        let clipsTiming = '';
        let clipOverlaying = '';
        let overlayCommand = '';
        let bumperCommand = '';
        let logoCommand = '';

        let audioCommand = '';
        let subsCommand = '';
        let totalDuration = meta.movieDuration;
        let bumperInTime = '';
        let ffmpegCommand = '';
        let res = {};
        let totalClips = parseInt(clips.length);

        for (var key in clips) {

            if (!clips.hasOwnProperty(key)) continue;

            let clip = clips[key];
            let clipId = parseInt(clip.id);
            let clipMinusOne = clipId - 1;
            let clipPlusOne = clipId + 1;
            let clipPlusTwo = clipId + 2;
            let clipPlusThree = clipId + 3;

            // Input Overlays
            input = input + ' -i ' + folder + 'clips\\' + clip.id + '.mov';

            // Create the overlay command
            clipsTiming = clipsTiming + '[' + clip.id + ':v]setpts=PTS-STARTPTS+' + clip.start + '/TB,scale=' + '-1:' + meta.movieHeight + '[v' + clipId + '];';



            if (clip.id === 1) {
                clipOverlaying = clipOverlaying + '[0:v][v' + clipId + ']overlay=eof_action=pass[c' + clipId + '];';

            } else if (clip.id !== totalClips) {
                clipOverlaying = clipOverlaying + '[c' + clipMinusOne + '][v' + clipId + ']overlay=eof_action=pass[c' + clipId + '];';
            }

            if (clip.id === totalClips) {
                if (meta.bumper > 0) {
                    if (clip.id != 1) {
                        clipOverlaying = clipOverlaying + '[c' + clipMinusOne + '][v' + clipId + ']overlay=eof_action=pass[c' + clipId + '];';
                    }

                    totalDuration = meta.movieDuration + this.bumpers[meta.bumper].bumperLength - this.bumpers[meta.bumper].fade;
                    bumperInTime = meta.movieDuration - this.bumpers[meta.bumper].fade;
                    input = input + ' -i ' + this.bumpers[meta.bumper].fileRemote + ' -f lavfi -i color=c=black:s=' + meta.movieWidth + 'x' + meta.movieHeight;

                    if (meta.logo > 0) {
                        bumperCommand = '[' + clipPlusOne + ':v]scale=' + meta.movieWidth + ':-1[bumperRescaled];[' + clipPlusTwo + ':v]scale=' + meta.movieWidth + 'x' + meta.movieHeight + ',trim=duration=' + totalDuration + '[blackVideo];[bumperRescaled]format=yuva420p,setpts=PTS-STARTPTS+' + bumperInTime + '/TB[theBumper];[blackVideo][c' + clipId + ']overlay=x=0:y=0[longMovie];[longMovie][theBumper]overlay=x=0:y=0[longMovieBumper];';
                    } else {
                        totalDuration = meta.movieDuration;
                        bumperCommand = '[' + clipPlusOne + ':v]scale=' + meta.movieWidth + ':-1[bumperRescaled];[' + clipPlusTwo + ':v]scale=' + meta.movieWidth + 'x' + meta.movieHeight + ',trim=duration=' + totalDuration + '[blackVideo];[bumperRescaled]format=yuva420p,setpts=PTS-STARTPTS+' + bumperInTime + '/TB[theBumper];[blackVideo][c' + clipId + ']overlay=x=0:y=0[longMovie];[longMovie][theBumper]overlay=x=0:y=0[endMovie];';
                    }

                } else {
                    if (meta.logo > 0) {
                        if (clip.id === 1) {
                            //
                        } else {
                            clipOverlaying = clipOverlaying + '[c' + clipMinusOne + '][v' + clipId + ']overlay=eof_action=pass[c' + clipId + '];';
                        }
                    } else {
                        if (clip.id === 1) {
                            clipOverlaying = '[0:v][v' + clipId + ']overlay=eof_action=pass[endMovie];'
                        } else {
                            clipOverlaying = clipOverlaying + '[c' + clipMinusOne + '][v' + clipId + ']overlay=eof_action=pass[endMovie];';
                        }
                    }
                }

                if (meta.logo > 0 && meta.bumper === 0) {
                    input = input + ' -i ' + this.logos[meta.logo].fileRemote;
                    logoCommand = '[' + clipPlusOne + ']scale=' + meta.movieWidth / 6 + ':-1[logoRescaled];[c' + clipId + '][logoRescaled]overlay=x=10:y=10[endMovie];';
                } else if (meta.logo > 0 && meta.bumper > 0) {
                    input = input + ' -i ' + this.logos[meta.logo].fileRemote;
                    logoCommand = '[' + clipPlusThree + ':v]scale=' + meta.movieWidth / 6 + ':-1[logoRescaled];[longMovieBumper][logoRescaled]overlay=x=10:y=10[endMovie];';
                }

                // Should fix when no audio is on video
                if (meta.audio > 0) {
                    audioCommand = 'amix=inputs=2:duration=first:dropout_transition=3';
                } else {
                    audioCommand = 'amix=inputs=1:duration=first:dropout_transition=3';
                }

                if (subs.length > 0) {
                    subsCommand = ';[endMovie]ass=' + subsFolder + '[out]';
                    ffmpegCommand = 'ffmpeg' + input + ' -y -filter_complex \"\"' + clipsTiming + clipOverlaying + bumperCommand + logoCommand + audioCommand + subsCommand + '\"\" -map [out] -strict -2 -t ' + totalDuration + ' ' + folder + project + '.mp4';
                } else {
                    ffmpegCommand = 'ffmpeg' + input + ' -y -filter_complex \"\"' + clipsTiming + clipOverlaying + bumperCommand + logoCommand + audioCommand + '\"\" -map [endMovie] -strict -2 -t ' + totalDuration + ' ' + folder + project + '.mp4';

                }
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
                //console.log('send');
                this.toast.showToast('success', 'Uw video wordt zodra verwerkt, het resultaat wordt naar u doorgemailed.');
            });
    }

    visualsToJSON(visuals, subs, meta, project) {

        const deferred = this.$q.defer();

        if (visuals.length > 0) {

            let ffmpeg = '';
            let newClips = [];
            let template = '';

            for (var x = 0; x < visuals.length; x++) {
                template = visuals[x].template;
                //console.log('visual template = ', template);
                let clip = {};
                let attributes = {};
                attributes = this.clipTemplates[template].clip;
                //console.log('attributes =', attributes);
                for (var key in attributes) {
                    if (!attributes.hasOwnProperty(key)) continue;
                    clip[key] = attributes[key];
                }
                clip['render-status'] = 'ready';
                clip.bot = 'render';
                clip.last = 'false';
                clip.module = 'jpg2000';
                clip.email = meta.email;
                clip.output = project + '/clips/' + (x * 1 + 1);
                clip.id = x + 1;
                clip.start = visuals[x].start;
                clip.Text1 = visuals[x].Text1 || '{{off}}';
                clip.Text2DR = visuals[x].Text2DR || '{{off}}';

                // IF LAST: 
                if (visuals.length === x + 1) {
                    //console.log('is last');
                    //console.log(visuals.length, x, visuals.length === x + 1);

                    clip.last = true;
                    newClips.push(clip);
                    this.overlays(newClips, meta, project, subs)
                        .then((resp) => {
                            console.log('overlays =', resp);
                            ffmpeg = resp.ffmpeg;
                            newClips[(visuals.length) * 1 - 1].ffmpeg = ffmpeg;
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

    CreateSubFile(subs, email, projectId) {
        const deferred = this.$q.defer();
        if (subs) {
            let fileName = projectId + '.ass';
            let string = '';
            // Should place the styles in the templates instead of here, and just loop over them.
            string = '[Script Info]\nTitle: Nieuwshub subtitles\nScriptType: v4.00\nCollisions: Normal\n\n';
            string = string + '[V4 Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n';
            string = string + 'Style: Default,arial,24,&H00FFFFFF,,&H00000000,,0,0,0,0,100,100,0,0,1,1,0,2,5,5,30,1\n';
            string = string + 'Style: DeredactieBackdrop,arial,24,&H00FFFFFF,&H00FFFFFF,&H64000000,&H64000000,0,0,0,0,100,100,0,0,3,1,0,2,10,10,30,1\n';
            string = string + 'Style: DeredactieHighlight,DIN Condensed Bold,35,&H00FFFFFF,,&H0000FFFF,&H000000FF,0,0,0,0,100,100,0,0,3,1,0,2,10,10,30,1\n';
            string = string + 'Style: DeredactieExplainerBottom,DIN Condensed Bold,30,&H00FFFFFF,,,,0,0,0,0,100,100,0,0,0,0,0,2,5,5,30,1\n';
            string = string + 'Style: DeredactieExplainerTop,DIN Condensed Bold,30,&H00FFFFFF,,,,0,0,0,0,100,100,0,0,0,0,0,6,5,5,30,1\n';
            string = string + 'Style: DeredactieExplainerTopLeft,DIN Condensed Bold,30,&H00FFFFFF,,,,0,0,0,0,100,100,0,0,0,0,0,5,5,5,30,1\n';
            string = string + 'Style: DeredactieExplainerBottomLeft,DIN Condensed Bold,30,&H00FFFFFF,,,,0,0,0,0,100,100,0,0,0,0,0,1,5,5,30,1\n';
            string = string + 'Style: StubruDefault,helvetica,16,&H00FFFFFF,,&H00000000,,0,0,0,0,100,100,0,0,1,0.6,0,2,5,5,21,1\n';
            string = string + '[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n';
            angular.forEach(subs, (line) => {
                if (line.text !== undefined) {
                    let text = line.text

                    if (text.indexOf('\n') > -1) {
                        text = text.replace(/\n/g, '\\N');
                    }
                    text = text.replace(/\[/g, '{\\rDeredactieHighlight}');
                    text = text.replace(/\]/g, '{\\r}');
                    // if (text)
                    if (this.clipTemplates[line.template].clip.style.includes('DeredactieExplainer')) { text = '{\\fad(400,250)}' + text };
                    string = string + 'Dialogue: 0,' + this.msToTime(line.start) + ',' + this.msToTime(line.end) + ',' + this.clipTemplates[line.template].clip.style + ',,0,0,0,,' + text + '\n';
                }
            });
            let file = new Blob([string], {
                type: 'ass'
            });
            this.uploadSubFileToServer(file, fileName, email).then((res) => {
                deferred.resolve(res);
            })
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
        let logo, audio, bumper, bumperAudio;

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
            bumperAudio = this.bumpers[meta.bumper].audio;
        } else { bumper = false };
        let assets = {
            fade: fade,
            bumperLength: bumperLength,
            logo: logo,
            audio: audio,
            bumper: bumper,
            bumperAudio: bumperAudio
        }
        deferred.resolve(assets);
        return deferred.promise;
    }

    getTempUrl(path) {
        const deferred = this.$q.defer();
        this.$http({
                data: { path: path },
                method: 'POST',
                url: '/api/movie/getTempUrl/'
            })
            .then((res) => {
                //console.log('the response of getting the temp url', res);
                deferred.resolve(res);
            }, (err) => {
                deferred.reject(res);
                //console.error('Error', err);
            });
        return deferred.promise;
    }



    renderMovie(subs, visuals, meta, projectId) {

        const deferred = this.$q.defer();
        let uniqueProjectName = meta.projectId;
        let videoName = uniqueProjectName + '.mp4';
        this.getTempUrl(meta.dropboxPath).then((res) => {
            //console.log(res.data);

            meta.movieUrl = res.data;

            this.$q.all([
                this.getAssets(meta),
                this.CreateSubFile(subs, meta.email, uniqueProjectName),
                this.visualsToJSON(visuals, subs, meta, uniqueProjectName),
            ]).then((value) => {
                let assets = value[0];
                let assFile = value[1];
                let visualClips = value[2];

                if (!visualClips && assFile) {
                    this.$http({
                            data: { ass: assFile.data.url, email: meta.email, videoName: videoName, movie: meta.movieUrl, duration: meta.movieDuration, width: meta.movieWidth, height: meta.movieHeight, logo: assets.logo, audio: assets.audio, bumper: assets.bumper, fade: assets.fade, bumperLength: assets.bumperLength, project: projectId, visualClips: visualClips, bumperAudio: assets.bumperAudio },
                            method: 'POST',
                            url: '/api/movie/burnSubs/'
                        })
                        .then((res) => {
                            //console.log(res);
                            deferred.resolve(res);
                        }, (err) => {
                            deferred.reject(res);
                            //console.error('Error', err);
                        });
                } else if (visualClips && !assFile) {
                    //console.log('There are visual clips but no subs, so send the complete ffmpeg line to the templater pc');
                    this.sendToAfterEffects(visualClips)
                } else if (visualClips && assFile) {
                    this.sendToAfterEffects(visualClips)
                } else {
                    //console.log('there is nothing, chillax');
                }
            }, function(error) {
                console.log(error);
            });

        })

        return deferred.promise;
    }
}
templaterService.$inject = ['$log', '$q', '$http', 'toast', '$sce', 'Upload'];
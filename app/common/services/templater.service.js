// TODO: refactoring that=this bullshit

export default class templaterService {
    constructor($log, $q, $http, toast, $sce) {
        this.$log = $log;
        this.$q = $q;
        this.$http = $http;
        this.toast = toast;
        this.$sce = $sce;


        this.root = 'D:\\videoTemplater\\dropbox\\';
        this.inFolder = this.root + 'in\\';


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
            'brand': 'deredactie.be',
            'fileLocal': null,
            'fileRemote': null
        }, {
            'name': 'Deredactie.be simpel',
            'id': 1,
            'brand': 'deredactie.be',
            'fileLocal': 'assets/logos/deredactie_2.mov',
            'fileRemote': this.root + 'logos\\deredactie_2.mov'
        }];


        this.bumpers = [{
            'name': 'geen',
            'id': 0,
            'brand': 'deredactie.be',
            'fileLocal': null,
            'fileRemote': null
        }, {
            'name': 'Deredactie.be simpel',
            'id': 1,
            'brand': 'deredactie.be',
            'fileLocal': 'assets/bumpers/deredactie_1.mov',
            'fileRemote': this.root + 'bumpers\\deredactie_1.mov',
            'fade': 2,
            'bumperLength': 4
        }];


    }




    addAudio(ffmpeg, audio, project, state) {
        const deferred = this.$q.defer();
        const folder = this.root + 'out\\' + project + '\\';
        if (audio !== 0) {
            ffmpeg = ffmpeg + ' && ffmpeg -i ' + folder + project + state + '.mp4' + ' ' + folder + project + '_audioTrack.mp3 && ffmpeg -i ' + folder + project + 'audioTrack.mp3 -i ' + this.audioTracks[audio].fileRemote + ' -filter_complex amerge -c:a libmp3lame -q:a 4 ' + folder + project + 'audioMix.mp3 && ffmpeg -i ' + folder + project + state + '.mp4' + ' -i ' + folder + project + 'audioMix.mp3 -c:v copy -c:a aac -strict experimental -map 0:v:0 -map 1:a:0 ' + folder + project + state + '_audio.mp4';
            state = state + '_bumper';
            let resp = {
                ffmpeg: ffmpeg,
                state: state
            };
            deferred.resolve(resp);
        } else {
            let resp = {
                ffmpeg: ffmpeg,
                state: state
            };
            deferred.resolve(resp);
        }
        return deferred.promise;
    }

    addLogo(ffmpeg, logo, project, state) {
        const deferred = this.$q.defer();
        const folder = this.root + 'out\\' + project + '\\';
        console.log(logo);
        if (logo !== 0) {
            ffmpeg = ffmpeg + ' && ffmpeg -i ' + folder + project + '_clean.mp4' + ' -i ' + this.logos[logo].fileRemote + ' -filter_complex overlay=10:10 ' + folder + project + state + '_logo.mp4';
            state = state + '_logo';
            let resp = {
                ffmpeg: ffmpeg,
                state: state
            };

        } else {
            let resp = {
                ffmpeg: ffmpeg,
                state: state
            };
            deferred.resolve(resp);
        }
        return deferred.promise;
    }

    addBumper(ffmpeg, bumper, duration, project, state) {
        const deferred = this.$q.defer();
        const folder = this.root + 'out\\' + project + '\\';
        if (bumper !== 0) {
            ffmpeg = ffmpeg + ' && ffmpeg -i ' + folder + project + state + '.mp4' + ' -i ' + this.bumpers[bumper].fileRemote + ' -filter_complex \"\"color=black:1920x1080:d=' + duration + '[base];[0:v]setpts=PTS-STARTPTS[v0];[1:v]format=yuva420p,setpts=PTS-STARTPTS+((' + (duration - this.bumpers[bumper].fade) + ')/TB)[v1];[base][v0]overlay[tmp];[tmp][v1]overlay,format=yuv420p[fv]\"\" -map [fv] -c copy -c:v libx264 -b:v 1000k ' + folder + project + state + '_bumper.mp4';
            state = state + '_bumper';
            let resp = {
                ffmpeg: ffmpeg,
                state: state
            };
            deferred.resolve(resp);
        } else {
            let resp = {
                ffmpeg: ffmpeg,
                state: state
            };
            deferred.resolve(resp);
        }
        return deferred.promise;
    }

    overlays(clips, meta, project) {
        const deferred = this.$q.defer();
        console.log(project);
        const folder = this.root + 'out\\' + project + '\\';
        let state = '';
        let resp = '';
        let ffmpeg = '';
        let clipsToOverlay = '';
        let clipsTiming = '';
        let clipOverlaying = '';
        angular.forEach(clips, (clip) => {
            let clipId = parseInt(clip.id);
            let clipMinusOne = clipId - 1;
            let total = parseInt(clips.length);
            clipsToOverlay = clipsToOverlay + ' -i ' + folder + 'clips\\' + clip.id + '.mov';
            clipsTiming = clipsTiming + '[' + clip.id + ':v]setpts=PTS-STARTPTS+' + clip.start + '/TB[v' + clipId + '];';
            clipOverlaying = clipOverlaying + ';[c' + clipMinusOne + '][v' + clipId + ']overlay=eof_action=pass[c' + clipId + ']';
            if (clipId === total) {
                ffmpeg = 'ffmpeg -i ' + this.inFolder + meta.movieName + clipsToOverlay + ' -filter_complex \"\"[0:v]setpts=PTS-STARTPTS[v0];' + clipsTiming + '[v0]scale=1920:1080 [c0]' + clipOverlaying + '\"\" -map [c' + clipId + '] -map 0:1? ' + folder + project + '_clean.mp4';
                state = '_clean';
                resp = {
                    ffmpeg: ffmpeg,
                    state: '_clean'
                };
                deferred.resolve(resp);
            }
        });
        return deferred.promise;
    }

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


    send(clips) {
        console.log('clips');
        let params = {
            movieClips: clips
        };
        console.log('send');
        this.$http.post('api/movie/update-movie-json', params)
            .then(() => {
                console.log('send');
                this.toast.showToast('success', 'Uw video wordt zodra verwerkt, het resultaat wordt naar u doorgemailed.');
            });
    }

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
                return '0' + Math.round((number / 10));



            } else {
                number = Math.round((number / 10));
                return number;
            }
        };


        let time = dur.hours + ':' + twoDigits(dur.minutes) + ':' + twoDigits(dur.seconds) + '.' + round(dur.millis);
        console.log(time);

        return time;
    }


    createAss(json) {
        const deferred = this.$q.defer();
        let string = '';
        string = '[Script Info]\nTitle: Nieuwshub subtitles\nScriptType: v4.00\nCollisions: Normal\n\n';
        string = string + '[V4 Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n';
        string = string + 'Style: Default,arial,24,&H00FFFFFF,,&H00000000,,0,0,0,0,100,100,0,0,1,1,0,2,5,5,30,1\n\n';
        string = string + '[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n';
        angular.forEach(json, (line) => {
            if (line.text !== undefined) {
                console.log(line.text);
                let text = line.text

                if (text.indexOf('\n') > -1) {
                    console.log('found line break');
                    text = text.replace(/\n/g, '\\N');
                }
                // return $sce.trustAsHtml(text);
                string = string + 'Dialogue: 0,' + this.msToTime(line.start) + ',' + this.msToTime(line.end) + ',Default,,0,0,0,,' + text + '\n';
            }
        });
        deferred.resolve(string);
        return deferred.promise;
    }

}

templaterService.$inject = ['$log', '$q', '$http', 'toast', '$sce'];

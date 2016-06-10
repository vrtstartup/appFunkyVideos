// TODO: refactoring that=this bullshit

export default class ffmpegLineService {
    constructor($log, $q) {
        this.$log = $log;
        this.$q = $q;
    }





    addAudio(ffmpeg, audio, root, project, state) {
        const deferred = this.$q.defer();

        let folder = root + 'projects\\' + project + '\\';



        if (audio !== null) {

            ffmpegLine = ffmpegLine + ' && ffmpeg -i ' + folder + project + state + '.mp4' + ' ' + folder + project + '_audioTrack.mp3 && ffmpeg -i ' + folder + project + 'audioTrack.mp3 -i ' + audio + ' -filter_complex amerge -c:a libmp3lame -q:a 4 ' + folder + project + 'audioMix.mp3 && ffmpeg -i ' + folder + project + state + '.mp4' + ' -i ' + folder + project + 'audioMix.mp3 -c:v copy -c:a aac -strict experimental -map 0:v:0 -map 1:a:0 ' + folder + project + state + '_audio.mp4';
            ffmpeg = ffmpeg + ' && ffmpeg -i ' + folder + project + '_clean.mp4' + ' -i ' + logo + ' -filter_complex overlay=10:10 ' + folder + project + state + '_logo.mp4';
            deferred.resolve(ffmpeg, state + '_bumper');

        } else {
            deferred.resolve(ffmpeg, state);
        }

        return deferred.promise;

    }

    addLogo(ffmpeg, logo, root, project, state) {
        const deferred = this.$q.defer();

        if (logo !== null) {
            ffmpeg = ffmpeg + ' && ffmpeg -i ' + folder + project + '_clean.mp4' + ' -i ' + logo + ' -filter_complex overlay=10:10 ' + folder + project + state + '_logo.mp4';
            deferred.resolve(ffmpeg, state + '_logo');
        } else {
            deferred.resolve(ffmpeg, state);
        }

        return deferred.promise;
    }

    addBumper(ffmpeg, bumper, fade, duration, root, project, state) {
        // ffmpeg -i '+videoWithLogo+' -i '+bumperPath+bumpers[i].url+' -filter_complex "color=black:1280x720:d='+lengthTotalVideo+'[base];[0:v]setpts=PTS-STARTPTS[v0];[1:v]format=yuva420p,setpts=PTS-STARTPTS+(('+ (lengthTotalVideo - lengthFade) +')/TB)[v1];[base][v0]overlay[tmp];[tmp][v1]overlay,format=yuv420p[fv]" -map [fv] -c copy -c:v libx264 -b:v 1000k '+  outputPath+movieId+'.mp4

        const deferred = this.$q.defer();

        if (bumper !== null) {
            ffmpeg = ffmpeg + ' && ffmpeg -i ' + folder + project + state + '.mp4' + ' -i ' + bumper + ' -filter_complex \"\"color=black:1280x720:d='+duration+'[base];[0:v]setpts=PTS-STARTPTS[v0];[1:v]format=yuva420p,setpts=PTS-STARTPTS+(('+ (duration - fade) +')/TB)[v1];[base][v0]overlay[tmp];[tmp][v1]overlay,format=yuv420p[fv]\"\" -map [fv] -c copy -c:v libx264 -b:v 1000k '+  folder + project + state + '_bumper.mp4';
            deferred.resolve(ffmpeg, state + '_bumper');
        } else {
            deferred.resolve(ffmpeg, state);
        }

        return deferred.promise;

    }

    videoOverlays(clips, meta, root, project) {
        const deferred = this.$q.defer();

        let ffmpegLine = '';
        let clipsToOverlay = '';
        let clipsTiming = '';
        let clipOverlaying = '';

        let folder = root + 'projects\\' + project + '\\';


        angular.forEach(clips, (clip) => {
            let clipId = parseInt(clip.id);
            let clipMinusOne = clipId - 1;
            let total = parseInt(clips.length);

            clipsToOverlay = clipsToOverlay + ' -i ' + folder + 'clips\\' + clip.id + '.mov';
            clipsTiming = clipsTiming + '[' + clip.id + ':v]setpts=PTS-STARTPTS+' + clip.start + '/TB[v' + clipId + '];';
            clipOverlaying = clipOverlaying + ';[c' + clipMinusOne + '][v' + clipId + ']overlay=eof_action=pass[c' + clipId + ']';

            if (clipId === total) {
                ffmpegLine = 'ffmpeg -i ' + folder + meta.movieName + clipsToOverlay + ' -filter_complex \"\"[0:v]setpts=PTS-STARTPTS[v0];' + clipsTiming + '[v0]scale=1920:1080 [c0]' + clipOverlaying + '\"\" -map [c' + clipId + '] -map 0:1? ' + folder + project + '_clean.mp4';
                deferred.resolve(ffmpegLine, '_clean');
            }
        });
        return deferred.promise;
    }



}

ffmpegLineService.$inject = ['$log', '$q'];

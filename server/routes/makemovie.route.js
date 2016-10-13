'use strict';

var express = require('express');
var router = express.Router();

var ffmpeg = require('fluent-ffmpeg');

router.get('/makemovie', function(req, res) {

    let overlayArray = [ 
        { type: 'title', path: 'temp/test/overlay_1.mov', stTime: '0'},
        { type: 'title', path: 'temp/test/overlay_2.mov', stTime: '8'},
        { type: 'title', path: 'temp/test/overlay_3.mov', stTime: '16'},
        { type: 'logo', path: 'temp/test/logo.mov', stTime: '0', scale: 4, offset_x: 10, offset_y: 10 },
        { type: 'outro', path: 'temp/test/outro.mov', stTime: '29', transTime: ''}, 
        // outro should always be last ! and has a starttime based on length & tansp part in outro
    ];

    let logo_x = 10;
    let logo_y = 10;
    let logo_scale = 75;

    let movie_w = 320;
    let movie_h = 182;

    let movie_duration = 31;
    let outro_duration = overlayArray[(overlayArray.length-1)].stTime ;
    let outro_transtime = overlayArray[(overlayArray.length-1)].transTime ;
    
    let logo = checkType('logo', overlayArray); // flag
    let outro = checkType('outro', overlayArray); // flag

    function checkType(type, arr){
        for (let o of arr) {
            if (o.type === type) {
                return true;
            }
        }
        return false;
    }

    function checkIndex(type, arr){
        let index
        arr.forEach( (el, ind) => {
            if( el.type == type){
                console.log('ind', ind);
                index = ind;
            }
        })
        return index;
    }


    /* ------------------------------- */
    /* -- SET MOVIE DURATION --------- */
    /* ------------------------------- */
    
    let final_duration = movie_duration;
    if(outro){ 
        final_duration = movie_duration + outro_duration - outro_transtime;
    }



    /* ------------------------------- */
    /* -- SET INPUTS ----------------- */
    /* ------------------------------- */

    var ffmpegtest = new ffmpeg();
    
    // GENERATE CONTAINER : SET SIZE : SET DURATION
    ffmpegtest
        .input('color=c=black:s=' + movie_w + 'x' + movie_h + ',trim=duration=' + final_duration)
        .inputFormat('lavfi')              //0:v
        .input('temp/test/low.mp4')        //1:v

    // INPUT CHAIN overlays(titles) 
    overlayArray.forEach( (el) => {
        ffmpegtest = ffmpegtest.input(el.path);    
    });



    /* ------------------------------- */
    /* -- SET START & SCALE ------- */
    /* ------------------------------- */

    // SET START & SCALE (SS)
    function setStartPosAndScale(){
        let startAndScaleLine = '';
        // OVERLAY
        overlayArray.forEach( (el, i) => {
            // (i+2), because overlayArray doesn't include black & low.mp4
            if(el.scale) { // only logo has extra scale value on movie_x
                startAndScaleLine =  startAndScaleLine +  '[' + (i+2) + ':v]setpts=PTS-STARTPTS+' + el.stTime + '/TB,scale=' + (movie_w / el.scale) + ':-1[' + (i) + '];' ;
            } else {
                startAndScaleLine =  startAndScaleLine +  '[' + (i+2) + ':v]setpts=PTS-STARTPTS+' + el.stTime + '/TB,scale=' + movie_w + ':-1[' + (i) + '];' ;
            }
        });
        return startAndScaleLine;
    }

    /*
    inp     strpos
    [0:v]                               (black)
    [1:v]                 movie       (low.mp4)
    [2:v]   0             movie_0 
    [3:v]   1             movie_0_1
    [4:v]   2             movie_0_1_2
    [5:v]   3(logo)       movie_0_1_2_3
    [6:v]   4(bumper)     movie_0_1_2_3_4 - out
    */

    /* ------------------------------- */
    /* -- MERGE OVERLAYS  ------------ */
    /* ------------------------------- */

    // OVERLAYS(titles)
    // Recursively chain overlay inputs
    function makeOverlaysString(){
        let overlayLine = '';
        let output = '';
        
        // transform overlay_arr to ov 
        
        let ovArr = ['movie'];
        overlayArray.forEach( (el, ind) => {
            ovArr.push('' + ind);
        })

        // [ 'movie', '0', '1', '2', '3', '4' ]
        while ( ovArr.length > 1) {

            output = ovArr[0] + '_' + ovArr[1];

            //IF logo set x & y offset
            let ovInd = parseInt( ovArr[1] );
            if( overlayArray[ovInd].type === 'logo' ){
                overlayLine += '['+ ovArr[0] + ']['+ ovArr[1] + ']overlay=x=' + overlayArray[ovInd].offset_x + ':y=' + overlayArray[ovInd].offset_x + '['+ output +'];' ;
            } else {
                overlayLine += '['+ ovArr[0] + ']['+ ovArr[1] + ']overlay=x=0:y=0['+ output +'];' ;
            }
            ovArr.splice(0, 2, output);
        }

        overlayLine = overlayLine.replace(output, 'output'); // replace output by outputname
        return overlayLine ;
    }



    /* ------------------------------- */
    /* -- COMBINE LINES -------------- */
    /* ------------------------------- */

    function makeComplexFilter(){
        let complxLine = '';
        // no logo - no bumper - no titles
        if(!overlayArray.length) {
            complxLine = '[0:v][1:v]overlay=x=0:y=0[out]';
            return complxLine;
        }

        complxLine = '[0:v][1:v]overlay=x=0:y=0[movie];' ; // movie on black-container
        complxLine += setStartPosAndScale() + makeOverlaysString() ;
        
        // CLEANUP
        complxLine = complxLine.replace(';;', ';');
        complxLine = complxLine.substring(0, complxLine.length - 1);
        
        return complxLine;
    }

/*
ffmpeg 
-f lavfi -i color=c=black:s=320x182,trim=duration=3129 
-i temp/test/low.mp4 
-i temp/test/overlay_1.mov 
-i temp/test/overlay_2.mov 
-i temp/test/overlay_3.mov 
-i temp/test/logo.mov 
-i temp/test/outro.mov

-y -filter_complex 
[0:v][1:v]overlay=x=0:y=0[movie];
[2:v]setpts=PTS-STARTPTS+0/TB,scale=320:-1[0];
[3:v]setpts=PTS-STARTPTS+8/TB,scale=320:-1[1];
[4:v]setpts=PTS-STARTPTS+16/TB,scale=320:-1[2];
[5:v]setpts=PTS-STARTPTS+0/TB,scale=80:-1[3];
[6:v]setpts=PTS-STARTPTS+29/TB,scale=320:-1[4];

[movie][0]overlay=x=0:y=0[movie_0];
[movie][0]overlay=x=0:y=0[movie_0];
[movie_0][1]overlay=x=0:y=0[movie_0_1];
[movie_0][1]overlay=x=0:y=0[movie_0_1];
[movie_0_1][2]overlay=x=0:y=0[movie_0_1_2];
[movie_0_1][2]overlay=x=0:y=0[movie_0_1_2];
[movie_0_1_2][3]overlay=x=0:y=0[movie_0_1_2_3];
[movie_0_1_2][3]overlay=x=10:y=10[movie_0_1_2_3];
[movie_0_1_2_3][4]overlay=x=0:y=0[output];
[movie_0_1_2_3][4]overlay=x=0:y=0[movie_0_1_2_3_4]; -map [output] temp/test/output.mp4
*/

    /* ------------------------------- */
    /* -- FiNAL ---------------------- */
    /* ------------------------------- */

ffmpegtest    
    .complexFilter([
        makeComplexFilter(),
        //'[out]null[output]', // pass out to output
    ], 'output')
    .saveToFile( 'temp/test/output.mp4', function (stdout, stderr) {
        console.log('file has been created');
    })
    .on('start', function (commandLine) {
        console.log('Spawned Ffmpeg with command: ' + commandLine);
    })
    .on('progress', function (progress) {
        console.log('creating movie', progress);
    })
    .on('end', function () {
        console.log('done');
    })
    .on('error', function(err, stdout, stderr) {
        console.log('Error: ' + err.message);
        console.log('ffmpeg output:\n' + stdout);
        console.log('ffmpeg stderr:\n' + stderr);
    });
    

});

module.exports = router;

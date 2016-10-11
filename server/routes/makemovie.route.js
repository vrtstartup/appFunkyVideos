var express = require('express');
var router = express.Router();

var ffmpeg = require('fluent-ffmpeg');


router.get('/makemovie', function(req, res) {

    
    let inpArr = ['movie', 'overlay_1', 'overlay_2', 'overlay_3', 'logo', 'bumper'];
    let overlayArray = [ 
        { path: 'temp/test/overlay_1.mov', stTime: '0',},
        { path: 'temp/test/overlay_2.mov', stTime: '4',},
        { path: 'temp/test/overlay_3.mov', stTime: '8',},
    ];
    let logo = inpArr.includes('logo'); //flag
    let bumper = inpArr.includes('bumper'); //flag

    var ffmpegtest = new ffmpeg();

    // GENERATE CONTAINER : SET SIZE : SET DURATION
    ffmpegtest
        .input('color=c=black:s=320x182,trim=duration=50')
        .inputFormat('lavfi')              //0:v
        .input('temp/test/low.mp4')        //1:v

    // INPUT CHAIN overlays(titles) 
    overlayArray.forEach( (el) => {
        ffmpegtest = ffmpegtest.input(el.path);    
    });

    // LOGO AND BUMPER 
    function setLogoAndBumper(){
        let logoLine = '';
        let bumperLine = '';
        const inputIndex = overlayArray.length + 2; // black(0) | movie(1) | overlay(2) | overlay(3) | overlay(4)

        if(logo && !bumper){
            ffmpegtest
                .input('temp/test/logo.mov')
            logoLine = '[' + inputIndex + ':v]setpts=PTS-STARTPTS,scale=75:-1[logo];';
            return logoLine;
        } else if(bumper && !logo) {
            ffmpegtest
                .input('temp/test/bumper.mov')
            bumperLine = '[' + inputIndex + ':v]setpts=PTS-STARTPTS+20/TB,scale=380:-1[bumper];';
            return bumperLine;
        } else if(bumper && logo) {
            ffmpegtest
                .input('temp/test/logo.mov')
                .input('temp/test/bumper.mov');
            logoLine = '[' + inputIndex + ':v]setpts=PTS-STARTPTS,scale=75:-1[logo];';
            bumperLine = '[' + (inputIndex + 1) + ':v]setpts=PTS-STARTPTS+20/TB,scale=380:-1[bumper];';
            return logoLine + bumperLine;
        } else {
            return '';
        }
    }

    // SET POS & SCALE
    // first input is 3th element of all inputs (i+2), output is zero based
    function setStartPosAndScale(){
        let posScaleLine = '';
        overlayArray.forEach( (el, i) => {
            posScaleLine =  posScaleLine +  '[' + (i+2) + ':v]setpts=PTS-STARTPTS+' + el.stTime + '/TB,scale=380:-1[overlay_' + (i+1) + '];' ;
        });
        posScaleLine = posScaleLine + setLogoAndBumper();
        return posScaleLine;
    }

    // OVERLAYS(titles)
    // Recursively chain overlay inputs
    let overlayLine = '';
    let output = '';
    
    function makeOverlaysString(){
        if( inpArr.length > 1) {
            output = inpArr[0] + '_' + inpArr[1];
            overlayLine += '['+ inpArr[0] + ']['+ inpArr[1] + ']overlay=x=0:y=0['+ output +'];' ;
            inpArr.splice(0, 2, output);
            return makeOverlaysString();
        } else {
            overlayLine = overlayLine.replace(output, 'out'); // replace output by outputname
            return overlayLine ;
        }
    }

    function makeComplexFilter(){
        let complxLine = setStartPosAndScale() + makeOverlaysString() ;
        complxLine = complxLine.replace(';;', ';');
        complxLine = complxLine.substring(0, complxLine.length - 1);
        return complxLine;
    }
/*
*/

ffmpegtest    
    .complexFilter([
        '[0:v][1:v]overlay=x=0:y=0[movie]', // movie on black-container
        makeComplexFilter(),
        '[out]null[output]', // movie with logo
    ], 'output')
    .saveToFile( 'temp/test/output.mp4', function (stdout, stderr) {
        console.log('file has been created with soundtrack succesfully');
    })
    .on('start', function (commandLine) {
        console.log('Spawned Ffmpeg with command: ' + commandLine);
    })
    .on('progress', function (progress) {
        console.log('creating low res version', progress);
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

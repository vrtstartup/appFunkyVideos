import angular from 'angular';
import pieChart from './pieChart';
import text from './text';
import screenshot from './screenshot';
import templateBob from './templateBob';
import templateTina from './templateTina';
import templateDethklok from './templateDethklok';
import templateMurderface from './templateMurderface';
import templateWartooth from './templateWartooth';
import templateSkwigelf from './templateSkwigelf';
import templateExplosion from './templateExplosion';
import templatePickels from './templatePickels';
import imagePreview from './imagePreview';
import subtitleLine from './subtitleLine';
import videoUploader from './videoUploader';
import videoPlayer from './videoPlayer';
import eventBlock from './eventBlock';
import feedback from './feedback';
import track from './track';
import maxlines from './maxlines';
import gridBar from './gridBar';
import mapsSimple from './mapsSimple';


const module = angular.module('app.common.directives', [
    pieChart, text, screenshot, templateDethklok, templateBob, templateTina,
    templateMurderface, templateWartooth, templateSkwigelf, templateExplosion, templatePickels,
    imagePreview, eventBlock, subtitleLine, videoUploader, videoPlayer, feedback, track, maxlines, gridBar, mapsSimple
]);

export default module.name;

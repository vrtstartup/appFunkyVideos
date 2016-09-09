import angular from 'angular';
import pieChart from './pieChart';
import text from './text';
import screenshot from './screenshot';
import templateBob from './templateBob';
import templateTina from './templateTina';
import templateLinda from './templateLinda';
import templateGin from './templateGin';
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
import userLogin from './userLogin';
import draggable from './draggable';
import templateFinn from './templateFinn';
import templateJake from './templateJake';
import audioPlayer from './audioPlayer';
import templateGiantBomb from './templateGiantBomb';
import movable from './movable';
import templateBmo from './templateBmo';
import templateLumpy from './templateLumpy';
import artistBlock from './artistBlock';
import templateCinnabon from './templateCinnabon';
import templateBubblegum from './templateBubblegum';
import templateTrunk from './templateTrunk';
import templateIceKing from './templateIceKing';
import templateMarceline from './templateMarceline';
import templatePeppermint from './templatePeppermint';
import templateStampington from './templateStampington';
import videoSlider from './videoSlider';
import drd01 from './pictureTemplates/drd01';
import drd02 from './pictureTemplates/drd02';
import drd03 from './pictureTemplates/drd03';
import drd04 from './pictureTemplates/drd04';
import zdd01 from './pictureTemplates/zdd01';

const module = angular.module('app.common.directives', [
    pieChart, text, screenshot, templateDethklok, templateBob, templateTina, templateLinda, templateGin,
    templateMurderface, templateWartooth, templateSkwigelf, templateExplosion, templatePickels,
    imagePreview, eventBlock, subtitleLine, videoUploader, videoPlayer, feedback, track, maxlines, gridBar, mapsSimple,
    userLogin, draggable, templateFinn, templateJake, templateGiantBomb, movable, templateBmo, templateLumpy,
    artistBlock, templateCinnabon, templateBubblegum, templateTrunk, templateIceKing, templateMarceline,
    audioPlayer, templatePeppermint, templateStampington, videoSlider, drd01, drd02, drd03, drd04, zdd01
]);

export default module.name;
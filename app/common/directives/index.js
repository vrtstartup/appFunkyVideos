import angular from 'angular';
import test from './test';
import pieChart from './pieChart';
import text from './text';
import screenshot from './screenshot';
import templateMurderface from './templateMurderface';
import templateWartooth from './templateWartooth';
import templateSkwigelf from './templateSkwigelf';
import imagePreview from './imagePreview';
import subtitleLine from './subtitleLine';
import videoUploader from './videoUploader';
import videoPlayer from './videoPlayer';
import eventBlock from './eventBlock';


const module = angular.module('app.common.directives', [
    test, pieChart, text, screenshot,
    templateMurderface, templateWartooth, templateSkwigelf, imagePreview,
    eventBlock, subtitleLine, videoUploader, videoPlayer,

]);

export default module.name;

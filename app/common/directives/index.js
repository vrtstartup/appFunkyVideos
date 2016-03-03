import angular from 'angular';
import test from './test';
import pieChart from './pieChart';
import text from './text';
import screenshot from './screenshot';
import templateMurderface from './templateMurderface';
import imagePreview from './imagePreview';
import subtitleLine from './subtitleLine';
import videoUploader from './videoUploader';
import videoPlayer from './videoPlayer';


const module = angular.module('app.common.directives', [
    test, pieChart, text, screenshot, templateMurderface, imagePreview, subtitleLine, videoUploader, videoPlayer
]);

export default module.name;

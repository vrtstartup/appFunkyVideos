import angular from 'angular';
import test from './test';
import pieChart from './pieChart';
import text from './text';
import screenshot from './screenshot';
import templateMurderface from './templateMurderface';
import templateWartooth from './templateWartooth';
import imagePreview from './imagePreview';


const module = angular.module('app.common.directives', [
    test, pieChart, text, screenshot, templateMurderface, templateWartooth, imagePreview,
]);

export default module.name;

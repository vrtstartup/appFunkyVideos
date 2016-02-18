import angular from 'angular';
import test from './test';
import pieChart from './pieChart';
import text from './text';
import screenshot from './screenshot';


const module = angular.module('app.common.directives', [
    test, pieChart, text, screenshot,
]);

export default module.name;

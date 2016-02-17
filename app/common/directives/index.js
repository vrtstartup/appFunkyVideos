import angular from 'angular';
import test from './test';
import pieChart from './pieChart';
import text from './text';


const module = angular.module('app.common.directives', [
    test, pieChart, text,
]);

export default module.name;

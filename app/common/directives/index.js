import angular from 'angular';
import test from './test';
import pieChart from './pieChart';


const module = angular.module('app.common.directives', [
    test, pieChart,
]);

export default module.name;

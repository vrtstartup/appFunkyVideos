import angular from 'angular';
import {pieChartDirective} from './pieChart.directive.js';

const module = angular.module('app.common.directives.pieChart', []);

module.directive('vrtPiechart', pieChartDirective);

export default module.name;

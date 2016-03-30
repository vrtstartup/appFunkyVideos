import angular from 'angular';
import {gridBarDirective} from './gridBar.directive.js';

const module = angular.module('app.common.directives.gridBar', []);

module.directive('vrtGridBar', gridBarDirective);

export default module.name;
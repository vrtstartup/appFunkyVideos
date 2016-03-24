import angular from 'angular';
import {maxlinesDirective} from './maxlines.directive.js';

const module = angular.module('app.common.directives.maxlines', []);

module.directive('vrtMaxlines', maxlinesDirective);

export default module.name;

import angular from 'angular';
import {subtitleLineDirective} from './subtitleLine.directive.js';

const module = angular.module('app.common.directives.subtitleLine', []);

module.directive('subtitleLine', subtitleLineDirective);

export default module.name;

import angular from 'angular';
import {textDirective} from './text.directive.js';

const module = angular.module('app.common.directives.text', []);

module.directive('vrtText', textDirective);

export default module.name;
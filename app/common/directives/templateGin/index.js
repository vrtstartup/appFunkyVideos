import angular from 'angular';
import {templateGinDirective} from './templateGin.directive.js';

const module = angular.module('app.common.directives.templateGin', []);

module.directive('vrtTemplateGin', templateGinDirective);

export default module.name;
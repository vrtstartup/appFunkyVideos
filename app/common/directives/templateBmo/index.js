import angular from 'angular';
import {templateBmoDirective} from './templateBmo.directive.js';

const module = angular.module('app.common.directives.templateBmo', []);

module.directive('vrtTemplateBmo', templateBmoDirective);

export default module.name;
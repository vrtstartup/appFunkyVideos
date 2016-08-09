import angular from 'angular';
import {templateStampingtonDirective} from './templateStampington.directive.js';

const module = angular.module('app.common.directives.templateStampington', []);

module.directive('vrtTemplateStampington', templateStampingtonDirective);

export default module.name;
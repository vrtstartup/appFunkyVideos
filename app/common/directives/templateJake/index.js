import angular from 'angular';
import {templateJakeDirective} from './templateJake.directive.js';

const module = angular.module('app.common.directives.templateJake', []);

module.directive('vrtTemplateJake', templateJakeDirective);

export default module.name;
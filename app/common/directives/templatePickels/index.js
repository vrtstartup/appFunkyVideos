import angular from 'angular';
import {templatePickelsDirective} from './templatePickels.directive.js';

const module = angular.module('app.common.directives.templatePickels', []);

module.directive('vrtTemplatePickels', templatePickelsDirective);

export default module.name;
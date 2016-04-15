import angular from 'angular';
import {templateLindaDirective} from './templateLinda.directive.js';

const module = angular.module('app.common.directives.templateLinda', []);

module.directive('vrtTemplateLinda', templateLindaDirective);

export default module.name;
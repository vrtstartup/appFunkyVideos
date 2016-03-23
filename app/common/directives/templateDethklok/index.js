import angular from 'angular';
import {templateDethklokDirective} from './templateDethklok.directive.js';

const module = angular.module('app.common.directives.templateDethklok', []);

module.directive('vrtTemplateDethklok', templateDethklokDirective);

export default module.name;
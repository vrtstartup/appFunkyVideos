import angular from 'angular';
import {templateLumpyDirective} from './templateLumpy.directive.js';

const module = angular.module('app.common.directives.templateLumpy', []);

module.directive('vrtTemplateLumpy', templateLumpyDirective);

export default module.name;
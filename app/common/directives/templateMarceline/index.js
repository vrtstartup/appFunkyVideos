import angular from 'angular';
import {templateMarcelineDirective} from './templateMarceline.directive.js';

const module = angular.module('app.common.directives.templateMarceline', []);

module.directive('vrtTemplateMarceline', templateMarcelineDirective);

export default module.name;
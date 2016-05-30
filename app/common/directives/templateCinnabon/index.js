import angular from 'angular';
import {templateCinnabonDirective} from './templateCinnabon.directive.js';

const module = angular.module('app.common.directives.templateCinnabon', []);

module.directive('vrtTemplateCinnabon', templateCinnabonDirective);

export default module.name;
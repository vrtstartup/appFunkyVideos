import angular from 'angular';
import {templateIceKingDirective} from './templateIceKing.directive.js';

const module = angular.module('app.common.directives.templateIceKing', []);

module.directive('vrtTemplateIceKing', templateIceKingDirective);

export default module.name;
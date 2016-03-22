import angular from 'angular';
import {templateExplosionDirective} from './templateExplosion.directive.js';

const module = angular.module('app.common.directives.templateExplosion', []);

module.directive('vrtTemplateExplosion', templateExplosionDirective);

export default module.name;
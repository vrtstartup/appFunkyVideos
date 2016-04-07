import angular from 'angular';
import {templateBobDirective} from './templateBob.directive.js';

const module = angular.module('app.common.directives.templateBob', []);

module.directive('vrtTemplateBob', templateBobDirective);

export default module.name;
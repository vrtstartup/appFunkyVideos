import angular from 'angular';
import {templateSkwigelfDirective} from './templateSkwigelf.directive.js';

const module = angular.module('app.common.directives.templateSkwigelf', []);

module.directive('vrtTemplateSkwigelf', templateSkwigelfDirective);

export default module.name;
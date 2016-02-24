import angular from 'angular';
import {templateWartoothDirective} from './templateWartooth.directive.js';

const module = angular.module('app.common.directives.templateWartooth', []);

module.directive('vrtTemplateWartooth', templateWartoothDirective);

export default module.name;
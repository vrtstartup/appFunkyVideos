import angular from 'angular';
import {templateBubblegumDirective} from './templateBubblegum.directive.js';

const module = angular.module('app.common.directives.templateBubblegum', []);

module.directive('vrtTemplateBubblegum', templateBubblegumDirective);

export default module.name;
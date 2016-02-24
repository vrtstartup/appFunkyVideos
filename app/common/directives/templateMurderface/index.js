import angular from 'angular';
import {templateMurderfaceDirective} from './templateMurderface.directive.js';

const module = angular.module('app.common.directives.templateMurderface', []);

module.directive('vrtTemplateMurderface', templateMurderfaceDirective);

export default module.name;
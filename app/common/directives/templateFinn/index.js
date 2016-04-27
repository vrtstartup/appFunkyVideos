import angular from 'angular';
import {templateFinnDirective} from './templateFinn.directive.js';

const module = angular.module('app.common.directives.templateFinn', []);

module.directive('vrtTemplateFinn', templateFinnDirective);

export default module.name;
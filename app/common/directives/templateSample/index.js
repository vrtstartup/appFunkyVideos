import angular from 'angular';
import {templateSampleDirective} from './templateSample.directive.js';

const module = angular.module('app.common.directives.templateSample', []);

module.directive('vrtTemplateSample', templateSampleDirective);

export default module.name;
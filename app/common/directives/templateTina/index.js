import angular from 'angular';
import {templateTinaDirective} from './templateTina.directive.js';

const module = angular.module('app.common.directives.templateTina', []);

module.directive('vrtTemplateTina', templateTinaDirective);

export default module.name;
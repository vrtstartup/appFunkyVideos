import angular from 'angular';
import {templateTrunkDirective} from './templateTrunk.directive.js';

const module = angular.module('app.common.directives.templateTrunk', []);

module.directive('vrtTemplateTrunk', templateTrunkDirective);

export default module.name;
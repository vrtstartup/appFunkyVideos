import angular from 'angular';
import {templatePeppermintDirective} from './templatePeppermint.directive.js';

const module = angular.module('app.common.directives.templatePeppermint', []);

module.directive('vrtTemplatePeppermint', templatePeppermintDirective);

export default module.name;
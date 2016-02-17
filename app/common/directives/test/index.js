import angular from 'angular';
import {testDirective} from './test.directive.js';

const module = angular.module('app.common.directives.test', []);

module.directive('vrtTest', testDirective);

export default module.name;

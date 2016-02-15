import angular from 'angular';
import {testDirective} from './test.directive.js';
import {testAnimation} from './test.animation.js';

const module = angular.module('app.common.directives.test', []);

module.directive('vrtTest', testDirective);
// module.animation('vrtTest', testAnimation);

export default module.name;

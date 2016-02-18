import angular from 'angular';
import {screenshotDirective} from './screenshot.directive.js';

const module = angular.module('app.common.directives.screenshot', []);

module.directive('vrtScreenshot', screenshotDirective);

export default module.name;
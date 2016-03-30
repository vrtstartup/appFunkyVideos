import angular from 'angular';
import {mapsSimpleDirective} from './mapsSimple.directive.js';

const module = angular.module('app.common.directives.mapsSimple', []);

module.directive('vrtMapsSimple', mapsSimpleDirective);

export default module.name;

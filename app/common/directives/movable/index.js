import angular from 'angular';
import {movableDirective} from './movable.directive.js';

const module = angular.module('app.common.directives.movable', []);

module.directive('vrtMovable', movableDirective);

export default module.name;

import angular from 'angular';
import {draggableDirective} from './draggable.directive.js';

const module = angular.module('app.common.directives.draggable', []);

module.directive('vrtDraggable', draggableDirective);

export default module.name;
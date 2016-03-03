import angular from 'angular';
import {eventBlockDirective} from './eventBlock.directive.js';

const module = angular.module('app.common.directives.eventBlock', []);

module.directive('vrtEventBlock', eventBlockDirective);

export default module.name;
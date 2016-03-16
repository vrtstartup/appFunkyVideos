import angular from 'angular';
import {trackDirective} from './track.directive.js';

const module = angular.module('app.common.directives.track', []);

module.directive('vrtTrack', trackDirective);

export default module.name;
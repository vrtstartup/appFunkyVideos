import angular from 'angular';
import {artistBlockDirective} from './artistBlock.directive.js';

const module = angular.module('app.common.directives.artistBlock', []);

module.directive('vrtArtistBlock', artistBlockDirective);

export default module.name;
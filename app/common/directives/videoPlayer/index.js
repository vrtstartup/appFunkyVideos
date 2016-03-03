import angular from 'angular';
import {videoPlayerDirective} from './videoPlayer.directive.js';

const module = angular.module('app.common.directives.videoPlayer', []);

module.directive('vrtVideoplayer', videoPlayerDirective);

export default module.name;

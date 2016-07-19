import angular from 'angular';
import {videoSliderDirective} from './videoSlider.directive.js';

const module = angular.module('app.common.directives.videoSlider', []);

module.directive('vrtVideoSlider', videoSliderDirective);

export default module.name;

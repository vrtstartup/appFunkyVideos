import angular from 'angular';
import {videoUploaderDirective} from './videoUploader.directive.js';

const module = angular.module('app.common.directives.videoUploader', []);
module.directive('vrtVideoUploader', videoUploaderDirective);

export default module.name;
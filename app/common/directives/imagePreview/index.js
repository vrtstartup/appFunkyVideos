import angular from 'angular';
import {imagePreviewDirective} from './imagePreview.directive.js';

const module = angular.module('app.common.directives.imagePreview', []);
module.directive('vrtImagePreview', imagePreviewDirective);

export default module.name;
import angular from 'angular';
import { zdd02Directive } from './directive.js';

const module = angular.module('app.common.directives.zdd02', []);

module.directive('vrtPictureZdd02', zdd02Directive);

export default module.name;
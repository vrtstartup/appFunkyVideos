import angular from 'angular';
import { zdd04Directive } from './directive.js';

const module = angular.module('app.common.directives.zdd04', []);

module.directive('vrtPictureZdd04', zdd04Directive);

export default module.name;
import angular from 'angular';
import { zdd05Directive } from './directive.js';

const module = angular.module('app.common.directives.zdd05', []);

module.directive('vrtPictureZdd05', zdd05Directive);

export default module.name;
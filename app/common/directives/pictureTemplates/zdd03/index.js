import angular from 'angular';
import { zdd03Directive } from './directive.js';

const module = angular.module('app.common.directives.zdd03', []);

module.directive('vrtPictureZdd03', zdd03Directive);

export default module.name;
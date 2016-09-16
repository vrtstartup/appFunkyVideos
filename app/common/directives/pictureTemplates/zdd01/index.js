import angular from 'angular';
import { zdd01Directive } from './directive.js';

const module = angular.module('app.common.directives.zdd01', []);

module.directive('vrtPictureZdd01', zdd01Directive);

export default module.name;
import angular from 'angular';
import { radio1_01Directive } from './directive.js';

const module = angular.module('app.common.directives.radio1_01', []);

module.directive('vrtPictureRadio101', radio1_01Directive);

export default module.name;
import angular from 'angular';
import { drd02Directive } from './directive.js';

const module = angular.module('app.common.directives.drd02', []);

module.directive('vrtPictureDrd02', drd02Directive);

export default module.name;
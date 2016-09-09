import angular from 'angular';
import { drd01Directive } from './directive.js';

const module = angular.module('app.common.directives.drd01', []);

module.directive('vrtPictureDrd01', drd01Directive);

export default module.name;
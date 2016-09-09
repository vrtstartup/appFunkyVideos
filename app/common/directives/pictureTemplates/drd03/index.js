import angular from 'angular';
import { drd03Directive } from './directive.js';

const module = angular.module('app.common.directives.drd03', []);

module.directive('vrtPictureDrd03', drd03Directive);

export default module.name;
import angular from 'angular';
import { drd05Directive } from './directive.js';

const module = angular.module('app.common.directives.drd05', []);

module.directive('vrtPictureDrd05', drd05Directive);

export default module.name;
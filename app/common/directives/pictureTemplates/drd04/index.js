import angular from 'angular';
import { drd04Directive } from './directive.js';

const module = angular.module('app.common.directives.drd04', []);

module.directive('vrtPictureDrd04', drd04Directive);

export default module.name;
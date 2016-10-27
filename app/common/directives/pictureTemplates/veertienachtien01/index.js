import angular from 'angular';
import { veertienachtien01Directive } from './directive.js';

const module = angular.module('app.common.directives.veertienachtien01', []);

module.directive('vrtPictureVeertienachtien01', veertienachtien01Directive);

export default module.name;
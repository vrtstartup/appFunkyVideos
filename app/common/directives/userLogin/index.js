import angular from 'angular';
import {userLoginDirective} from './userLogin.directive.js';

const module = angular.module('app.common.directives.userLogin', []);

module.directive('userLogin', userLoginDirective);

export default module.name;

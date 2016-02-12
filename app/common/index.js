import angular from 'angular';
import directives from './directives';

const module = angular.module('app.common', [
    directives,

]);

export default module.name;

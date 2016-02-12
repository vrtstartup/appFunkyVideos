import angular from 'angular';
import test from './test';

const module = angular.module('app.common.directives', [
    test,
]);

export default module.name;

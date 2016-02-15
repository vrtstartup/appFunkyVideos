import angular from 'angular';
import directives from './directives';
import services from './services';

const module = angular.module('app.common', [
    directives,
    services,
]);

export default module.name;

import angular from 'angular';
import directives from './directives';
import services from './services';
import filters from './filters';

const module = angular.module('app.common', [
    directives,
    services,
    filters,
]);

export default module.name;

import angular from 'angular';
import directives from './directives';
import services from './services';
import filters from './filters';
import httpErrorInterceptor from './core/httpErrorInterceptor';

const module = angular.module('app.common', [
    directives,
    services,
    filters,
]);

module.factory('httpErrorInterceptor', httpErrorInterceptor);

export default module.name;

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import templaterController from './templater.controller.js';
import './templater.scss';

const module = angular.module('app.components.templater', [
    uiRouter, ngMaterial,
]);

module.config(['$stateProvider', ($stateProvider) => {
    $stateProvider
        .state('templater', {
            url: '/templater',
            title: 'VRT - templater',
            templateUrl: '/components/templater/templater.html',
            controller: templaterController,
            controllerAs: 'vm',
        });
}]);

module.controller('TemplaterController', templaterController);

export default module.name;

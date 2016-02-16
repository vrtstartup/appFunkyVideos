import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import homeController from './home.controller.js';
import './home.scss';

const module = angular.module('app.components.home', [
    uiRouter, ngMaterial,
]);

module.config(['$stateProvider', ($stateProvider) => {
    $stateProvider
        .state('home', {
            url: '/',
            title: 'Funky VRT',
            templateUrl: '/components/home/home.html',
            controller: homeController,
            controllerAs: 'vm',
        });
}]);

module.controller('HomeController', homeController);

export default module.name;

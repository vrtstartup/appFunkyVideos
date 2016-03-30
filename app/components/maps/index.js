import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import mapsController from './maps.controller.js';
import './maps.scss';

const module = angular.module('app.components.maps', [
    uiRouter, ngMaterial,
]);

module.config(['$stateProvider', ($stateProvider) => {
    $stateProvider
        .state('maps', {
            url: '/maps',
            title: 'VRT Tools Maps',
            templateUrl: '/components/maps/maps.html',
            controller: mapsController,
            controllerAs: 'vm',
        });
}]);

module.controller('MapsController', mapsController);

export default module.name;

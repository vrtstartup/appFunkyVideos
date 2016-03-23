import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import gridController from './grid.controller.js';
import './grid.scss';

const module = angular.module('app.components.grid', [
    uiRouter, ngMaterial,
]);

module.config(['$stateProvider', ($stateProvider) => {
    $stateProvider
        .state('grid', {
            url: '/grid',
            title: 'VRT Tools Grid',
            templateUrl: '/components/grid/grid.html',
            controller: gridController,
            controllerAs: 'vm',
        });
}]);

module.controller('GridController', gridController);

export default module.name;

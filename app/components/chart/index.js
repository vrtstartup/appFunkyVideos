import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import chartController from './chart.controller.js';
import './chart.scss';

const module = angular.module('app.components.chart', [
    uiRouter, ngMaterial,
]);

module.config(['$stateProvider', ($stateProvider) => {
    $stateProvider
        .state('chart', {
            url: '/chart',
            title: 'VRT Chart Tool',
            templateUrl: '/components/chart/chart.html',
            controller: chartController,
            controllerAs: 'vm',
        });
}]);

module.controller('ChartController', chartController);

export default module.name;
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import explainersController from './explainers.controller.js';
import './explainers.scss';

const module = angular.module('app.components.explainers', [
    uiRouter, ngMaterial,
]);

module.config(['$stateProvider', ($stateProvider) => {
    $stateProvider
        .state('explainers', {
            url: '/explainers',
            title: 'VRT Explainer tool',
            templateUrl: '/components/explainers/explainers.html',
            controller: explainersController,
            controllerAs: 'vm',
        });
}]);

module.controller('ExplainersController', explainersController);

export default module.name;

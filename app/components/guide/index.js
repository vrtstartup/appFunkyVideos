import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import guideController from './guide.controller.js';
import './guide.scss';

const module = angular.module('app.components.guide', [
    uiRouter, ngMaterial,
]);

module.config(['$stateProvider', ($stateProvider) => {
    $stateProvider
        .state('guide', {
            url: '/guide',
            title: 'Guide',
            templateUrl: '/components/guide/guide.html',
            controller: guideController,
            controllerAs: 'vm',
        });
}]);

module.controller('GuideController', guideController);

export default module.name;

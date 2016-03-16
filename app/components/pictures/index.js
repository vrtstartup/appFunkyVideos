import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import picturesController from './pictures.controller.js';
import './pictures.scss';

const module = angular.module('app.components.pictures', [
    uiRouter, ngMaterial,
]);

module.config(['$stateProvider', ($stateProvider) => {
    $stateProvider
        .state('pictures', {
            url: '/pictures',
            title: 'VRT Pictures Tool',
            templateUrl: '/components/pictures/pictures.html',
            controller: picturesController,
            controllerAs: 'vm',
        });
}]);

module.controller('PicturesController', picturesController);

export default module.name;

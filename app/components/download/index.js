import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import downloadController from './download.controller.js';

const module = angular.module('app.components.download', [
    uiRouter, ngMaterial,
]);

module.config(['$stateProvider', ($stateProvider) => {
    $stateProvider
        .state('download', {
            url: '/download/:filename',
            title: 'VRT Tools Download',
            templateUrl: '/components/download/download.html',
            controller: downloadController,
            controllerAs: 'vm',
        })
        .state('downloadurl', {
            url: '/download',
            title: 'VRT Tools Download Video',
            templateUrl: '/components/download/download.html',
            controller: downloadController,
            controllerAs: 'vm',
        });
}]);

module.controller('DownloadController', downloadController);

export default module.name;

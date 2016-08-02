import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import adminController from './admin.controller.js';
import './admin.scss';

const module = angular.module('app.components.admin', [
    uiRouter, ngMaterial,
]);

module.config(['$stateProvider', ($stateProvider) => {
    $stateProvider
        .state('admin', {
            url: '/admin',
            title: 'Admin Page',
            templateUrl: '/components/admin/admin.html',
            controller: adminController,
            controllerAs: 'vm',
        });
}]);

module.controller('AdminController', adminController);

export default module.name;

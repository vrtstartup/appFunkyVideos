import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import audioController from './audio.controller.js';

const module = angular.module('app.components.audio', [
    uiRouter, ngMaterial,
]);

module.config(['$stateProvider', ($stateProvider) => {
    $stateProvider
        .state('audio', {
            url: '/audio',
            title: 'VRT Audio Tool',
            templateUrl: '/components/audio/audio.html',
            controller: audioController,
            controllerAs: 'vm',
        });
}]);

module.controller('AudioController', audioController);

export default module.name;
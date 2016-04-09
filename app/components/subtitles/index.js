import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import subtitlesController from './subtitles.controller.js';
import './subtitles.scss';

const module = angular.module('app.components.subtitles', [
    uiRouter, ngMaterial,
]);

module.config(['$stateProvider', ($stateProvider) => {
    $stateProvider
        .state('subtitles', {
            url: '/subtitles',
            title: 'VRT Subtitles Tool',
            templateUrl: '/components/subtitles/subtitles.html',
            controller: subtitlesController,
            controllerAs: 'vm',
        });
}]);

module.controller('SubtitlesController', subtitlesController);

export default module.name;

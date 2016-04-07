import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import moviesController from './movies.controller.js';
import './movies.scss';

const module = angular.module('app.components.movies', [
    uiRouter, ngMaterial,
]);

module.config(['$stateProvider', ($stateProvider) => {
    $stateProvider
        .state('movies', {
            url: '/movies',
            title: 'VRT Movie Tool (a.k.a. The Stitcher)',
            templateUrl: '/components/movies/movies.html',
            controller: moviesController,
            controllerAs: 'vm',
        });
}]);

module.controller('MoviesController', moviesController);

export default module.name;

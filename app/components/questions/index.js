import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';

import questionsController from './questions.controller.js';
import './questions.scss';

const module = angular.module('app.components.questions', [
    uiRouter, ngMaterial,
]);

module.config(['$stateProvider', ($stateProvider) => {
    $stateProvider
        .state('questions', {
            url: '/questions',
            title: 'VRT Tools Questions',
            templateUrl: '/components/questions/questions.html',
            controller: questionsController,
            controllerAs: 'vm',
        });
}]);

module.controller('QuestionsController', questionsController);

export default module.name;

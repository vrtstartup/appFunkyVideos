import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMessages from 'angular-messages';
import ngSanitize from 'angular-sanitize';
import ngMaterial from 'angular-material';
import ngFileSaver from 'angular-file-saver';
import rzModule from 'angularjs-slider';
import 'videogular';
import 'videogular-controls';
import 'angular-file-upload';
import imageCropper from 'angular-image-cropper';
import ngFileUpload from 'ng-file-upload';


import components from './components';
import common from './common';

import appComponent from './app.component';

export default angular
    .module('app', [
        // 3rd party
        uiRouter,
        ngMessages,
        ngSanitize,
        ngMaterial,
        ngFileSaver,
        'rzModule',
        'com.2fdevs.videogular',
        'com.2fdevs.videogular.plugins.controls',
        'angularFileUpload',
        imageCropper,
        ngFileUpload,
        // application
        components,
        common,
    ])
    .directive('app', appComponent)
    .run(registerStateEvents);

//set page title
registerStateEvents.$inject = ['$rootScope'];
function registerStateEvents($rootScope) {
    $rootScope.pageTitle = 'VRT';
    $rootScope.$on('$stateChangeSuccess', (event, toState) => {
        $rootScope.pageTitle = `${toState.title}`;
    });
}
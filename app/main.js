import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMessages from 'angular-messages';
import ngSanitize from 'angular-sanitize';
import ngMaterial from 'angular-material';
import 'angular-img-cropper';

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
        'angular-img-cropper',

        // application
        components,
        common,
    ])
    .directive('app', appComponent);


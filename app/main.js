import angular from 'angular';
import uiRouter from 'angular-ui-router';

import components from './components';
import common from './common';

import appComponent from './app.component';

export default angular
    .module('app', [
        // 3rd party
        uiRouter,
        // application
        components,
        common,
    ])
    .directive('app', appComponent);


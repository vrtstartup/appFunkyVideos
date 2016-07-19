import angular from 'angular';
import time from './seconds.filter.js';
import reverse from './reverse.filter.js';


const module = angular.module('app.common.filters', []);
module.filter('time', time);
module.filter('reverse', reverse);


export default module.name;
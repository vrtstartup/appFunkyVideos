import angular from 'angular';
import time from './seconds.filter.js';


const module = angular.module('app.common.filters', []);
module.filter('time', time);


export default module.name;
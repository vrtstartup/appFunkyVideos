import angular from 'angular';
import videoGeneration from './videoGeneration.service.js';

const module = angular.module('app.common.services', []);

module.service('videoGeneration', videoGeneration);

export default module.name;
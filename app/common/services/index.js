import angular from 'angular';
import videoGeneration from './videoGeneration.service.js';

import srt from './srt.service.js';


import fileReader from './fileReader.service.js';


const module = angular.module('app.common.services', []);

module.service('videoGeneration', videoGeneration);

module.service('srt', srt);

module.service('fileReader', fileReader);


export default module.name;
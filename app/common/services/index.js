import angular from 'angular';
import videoGeneration from './videoGeneration.service.js';
import srt from './srt.service.js';
import VideoUploader from './VideoUploader.service.js';
import fileReader from './fileReader.service.js';
import videogular from './videogular.service.js';
import toast from './toast.service.js';
import audioTrack from './audioTrack.service.js';

const module = angular.module('app.common.services', []);

module.service('videoGeneration', videoGeneration);
module.service('srt', srt);
module.service('videoUploader', VideoUploader);
module.service('fileReader', fileReader);
module.service('videogular', videogular);
module.service('toast', toast);

module.service('audioTrack', audioTrack);

export default module.name;
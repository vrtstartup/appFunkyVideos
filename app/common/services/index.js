import angular from 'angular';
import videoGeneration from './videoGeneration.service.js';
import srt from './srt.service.js';
import VideoUploader from './videoUploader.service.js';
import fileReader from './fileReader.service.js';
import videogular from './videogular.service.js';
import toast from './toast.service.js';
import audioTrack from './audioTrack.service.js';
import firebaseDB from './firebase.service.js';
import userManagement from './userManagement.service.js';
import canvasUtil from './canvasUtil.service.js';
import templater from './templater.service.js';
import hotkeysService from './hotkeys.service.js';

const module = angular.module('app.common.services', []);

module.service('videoGeneration', videoGeneration);
module.service('srt', srt);
module.service('videoUploader', VideoUploader);
module.service('fileReader', fileReader);
module.service('videogular', videogular);
module.service('toast', toast);
module.service('audioTrack', audioTrack);
module.service('firebaseDB', firebaseDB);
module.service('userManagement', userManagement);
module.service('canvasUtil', canvasUtil);
module.service('templater', templater);
module.service('hotkeysService', hotkeysService);

export default module.name;
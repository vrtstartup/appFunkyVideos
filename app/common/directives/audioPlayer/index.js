import angular from 'angular';
import {audioPlayerDirective} from './audioPlayer.directive.js';

const module = angular.module('app.common.directives.audioPlayer', []);

module.directive('vrtAudioplayer', audioPlayerDirective);

export default module.name;

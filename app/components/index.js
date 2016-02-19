import angular from 'angular';
import home from './home';
import subtitles from './subtitles';


const module = angular.module('app.components', [
    home, subtitles,

]);

export default module.name;

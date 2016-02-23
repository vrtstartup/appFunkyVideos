import angular from 'angular';
import home from './home';
import subtitles from './subtitles';
import pictures from './pictures';


const module = angular.module('app.components', [
    home, subtitles, pictures,

]);

export default module.name;

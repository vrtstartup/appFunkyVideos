import angular from 'angular';
import home from './home';
import subtitles from './subtitles';
import pictures from './pictures';
import chart from './chart';
import audio from './audio';

const module = angular.module('app.components', [
    home, subtitles, pictures, chart, audio,
]);

export default module.name;

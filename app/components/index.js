import angular from 'angular';
import home from './home';
import subtitles from './subtitles';
import pictures from './pictures';
import chart from './chart';
import templater from './templater';
import audio from './audio';
import grid from './grid';
import maps from './maps';

const module = angular.module('app.components', [
    home, subtitles, pictures, chart, templater, audio, grid, maps,
]);

export default module.name;

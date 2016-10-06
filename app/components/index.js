import angular from 'angular';
import home from './home';
import subtitles from './subtitles';
import testSubComponent from './subtitles/components/subtitles-listitem';
import pictures from './pictures';
import chart from './chart';
import templater from './templater';
import audio from './audio';
import grid from './grid';
import maps from './maps';
import movies from './movies';
import questions from './questions';
import download from './download';
import explainers from './explainers';
import admin from './admin';
import guide from './guide';

const module = angular.module('app.components', [
    home, subtitles, testSubComponent, pictures, chart, templater, audio, grid, maps, movies, questions, download, explainers, admin, guide
]);

export default module.name;

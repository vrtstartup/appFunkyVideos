import angular from 'angular';
import home from './home';
import subtitles from './subtitles';
import pictures from './pictures';
import chart from './chart';
import templater from './templater';


const module = angular.module('app.components', [
    home, subtitles, pictures, chart, templater
]);

export default module.name;

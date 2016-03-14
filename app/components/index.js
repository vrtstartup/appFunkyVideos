import angular from 'angular';
import home from './home';
import subtitles from './subtitles';
import pictures from './pictures';
import chart from './chart';


const module = angular.module('app.components', [
    home, subtitles, pictures, chart,
]);

export default module.name;

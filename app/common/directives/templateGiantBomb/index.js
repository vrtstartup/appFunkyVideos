import angular from 'angular';
import {templateGiantBombDirective} from './templateGiantBomb.directive.js';

const module = angular.module('app.common.directives.templateGiantBomb', []);
module.directive('vrtTemplateGiantBomb', templateGiantBombDirective);

export default module.name;
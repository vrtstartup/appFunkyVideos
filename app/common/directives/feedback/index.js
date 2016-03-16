import angular from 'angular';
import {feedbackDirective} from './feedback.directive.js';

const module = angular.module('app.common.directives.feedback', []);

module.directive('feedback', feedbackDirective);

export default module.name;

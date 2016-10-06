import angular from 'angular';

function SubtitleListController($scope) {
    var ctrl = this;
}

const module = angular.module('app.components.subtitlesListItem', []).component('test', {
  template: '<span>{{ $ctrl.input }}</span>',
  controller: SubtitleListController,
  bindings: {
    input: '='
  }
});

SubtitleListController.$inject = ["$scope"];

export default module.name;

 
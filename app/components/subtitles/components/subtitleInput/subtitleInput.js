import angular from 'angular';
// var templateUrl = require('ngtemplate!html!./subtitleInput.html');

function SubtitleInputController($scope) {
  let ctrl = this;
  // Parse template properties

   this.parseTemplate = ()=>{ 
    let ret = {};

    Object.keys(ctrl.template).forEach(function(key) {
      var val = ctrl.template[key];
      var isColor = key.indexOf("color") !== -1;
      var isTemplateFile = key.indexOf("aep") !== -1;
      var isStyle = key.indexOf("style") !== -1;

      if(val !== "{{off}}" && !isColor && !isTemplateFile && !isStyle){
        ret[key] = val;
      } 
    });

    return ret;
  }
}

const module = angular.module('app.components.SubtitleInput', []).component('subtitleInput', {
  restrict: 'E',
  template: `
  <md-input-container ng-repeat="(key, value) in $ctrl.parseTemplate()" class="md-block" layout="row" ng-if="$ctrl.template">
    <label>{{key}}</label>
    <textarea flex="100" class="flex-100" vrt-maxlines="2" maxlines-prevent-enter="true" id="subtitleText" name="title" ng-model="$ctrl.ref[key]" ng-change="updateparent()"></textarea>
</md-input-container>`,
  controller: SubtitleInputController,
  bindings: {
    template: "=",
    updateparent: '=',
    ref: "="
  }
});

SubtitleInputController.$inject = ["$scope"];

export default module.name;
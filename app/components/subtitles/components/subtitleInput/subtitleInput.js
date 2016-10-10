import angular from 'angular';

function SubtitleInputController($scope) {
  let ctrl = this;
  // Parse template properties
  console.log(this.template);

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
  templateUrl: '/components/subtitles/components/SubtitleInput/subtitleInput.html',
  controller: SubtitleInputController,
  bindings: {
    template: "=",
    updateparent: '=',
    ref: "="
  }
});

SubtitleInputController.$inject = ["$scope"];

export default module.name;
import template from './audioPlayer.directive.html';

class AudioPlayerDirectiveController {
    constructor($scope, $sce, videogular) {
        this.$sce = $sce;
        this.$scope = $scope;
        this.videogular = videogular;
        this.config = {};

        $scope.$watch('source', (value) => {
            if (!value) return;
            let audioSource = this.$sce.trustAsResourceUrl(value);
            this.config = {
                sources: [{ src: audioSource, type: 'audio/mpeg' }],
            };

        });
    }
}

export const audioPlayerDirective = function() {
    return {
        restrict: 'AE',
        template: template,
        scope: {
            source: '='
        },
        controller: AudioPlayerDirectiveController,
        controllerAs: 'vm',
    };
};

AudioPlayerDirectiveController.$inject = ['$scope', '$sce', 'videogular'];

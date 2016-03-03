class videoUploaderDirectiveController {
    constructor($log, $scope, videoUploader) {
        this.$log = $log;
        this.$scope = $scope;
        this.videoUploader = videoUploader;
        this.videoSrc = '';

        this.getFile = (file) => {
            console.log('file selected', file);
            console.log(videoUploader);
            this.videoUploader.upload(file, $scope)
                .then((result) => {
                    //this.$scope.imageSrc = result;
                    this.ngModel.$setViewValue(result);
                });
            return this.$scope.videoSrc;
        };

    }

    init(model) {
        this.ngModel = model;
    }
}

export const videoUploaderDirective = function() {
    return {
        restrict: 'A',
        scope: {},
        require: ['?ngModel', 'vrtVideoUploader'],
        controller: videoUploaderDirectiveController,
        controllerAs: 'vm',
        link: ($scope, el, attrs, ctrls) => {
            el.bind('change', (e) => {
                console.log('video uploader directive loaded');
                const file = (e.srcElement || e.target).files[0];

                const ngModel = ctrls[0];
                const videoCtrl = ctrls[1];

                videoCtrl.init(ngModel);
                videoCtrl.getFile(file);


            });
        },
    };

};

videoUploaderDirectiveController.$inject = ['$log', '$rootScope', 'videoUploader'];

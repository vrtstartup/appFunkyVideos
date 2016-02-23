export default class PicturesController {
    constructor($log, FileUploader, $scope) {
        this.$log = $log;
        this.$scope = $scope;
        //this.$scope.uploader = new FileUploader();
        //What do you mean, 'booze ain't food'? I'd rather chop off my ding-dong than admit that!
        this.isReady = false;

        console.log('PICTURES', this.$scope);


        //this.$scope.uploader = new FileUploader({
        //    autoUpload: true,
        //    onAfterAddingFile: (item) => {
        //        console.log('onAfterAddingFile', item);
        //    },
        //    removeAfterUpload: true,
        //    onBeforeUploadItem: (item) => {
        //        console.log('ITEM', item);
        //    }
        //});

    }

    getPicture() {
        console.log('getting picture!', this.isReady);
        this.isReady = true;
    }


}

PicturesController.$inject = ['$log', 'FileUploader', '$scope'];

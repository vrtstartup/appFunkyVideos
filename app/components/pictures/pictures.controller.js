export default class PicturesController {
    constructor($log, $scope) {
        this.$log = $log;
        this.$scope = $scope;

        //What do you mean, 'booze ain't food'? I'd rather chop off my ding-dong than admit that!
        this.isReady = false;

    }

    getPicture() {
        this.isReady = true;
    }


}

PicturesController.$inject = ['$log', '$scope'];

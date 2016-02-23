export default class PicturesController {
    constructor($log) {
        this.$log = $log;
        //What do you mean, 'booze ain't food'? I'd rather chop off my ding-dong than admit that!
        this.isReady = false;

        console.log('Pic pic', this.isReady);

    }

    getPicture() {
        console.log('getting picture!', this.isReady);
        this.isReady = true;
    }


}

PicturesController.$inject = ['$log'];

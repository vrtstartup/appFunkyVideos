export default class AudioController {
    constructor($log) {
        this.$log = $log;

        this.$log.info('Im audio controller');
    }


}

AudioController.$inject = ['$log'];

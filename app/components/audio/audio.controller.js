export default class AudioController {
    constructor($log) {
        this.$log = $log;
        var ctx = new AudioContext();

        this.$log.info('Im audio controller');
    }


}

AudioController.$inject = ['$log'];

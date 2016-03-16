export default class AudioController {
    constructor($log) {
        this.$log = $log;

        this.name = 'olalal';
        this.url = '../../assets/test.mp3';

        this.$log.info('Im audio controller');
    }


}

AudioController.$inject = ['$log'];

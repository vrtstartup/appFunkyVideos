export default class GridController {
    constructor($log) {
        this.$log = $log;

        this.$log.info('Hi, this is grid controller');

    }


}

GridController.$inject = ['$log'];

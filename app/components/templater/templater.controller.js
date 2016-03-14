export default class TemplaterController {
    constructor($log, $rootScope, $http) {
        this.$log = $log;
        this.$rootScope = $rootScope;
        this.$http = $http;
        //What do you mean, 'booze ain't food'? I'd rather chop off my ding-dong than admit that!

        this.test = "this is a test";

    }
}

TemplaterController.$inject = ['$log', '$rootScope', '$http'];

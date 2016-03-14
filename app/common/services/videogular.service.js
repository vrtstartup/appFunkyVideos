export default class videogularService {
    constructor($q) {
        this.$q = $q;
        this.api = '';

        this.onPlayerReady = function(api) {
             this.api = api;
        };

        this.getTotalTime = function() {
            return this.api.totalTime / 1000.0;
        };
    }

}

videogularService.$inject = ['$q'];
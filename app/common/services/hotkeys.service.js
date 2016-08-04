export default class hotKeysService {
    constructor(hotkeys, $q) {
        this.hotkeys = hotkeys;
        this.$q = $q;
    }

    addHotkey(combo, descr) {
        const deferred = this.$q.defer();
        this.hotkeys.add({
            combo: combo,
            description: descr,
            callback: () => {
                deferred.resolve();
            }
        });
        return deferred.promise;
    }
}

hotKeysService.$inject = ['hotkeys', '$q'];

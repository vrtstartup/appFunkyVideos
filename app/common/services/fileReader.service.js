export default class FileReaderService {
    constructor($q) {
        console.log('file reader service');
        this.$q = $q;
    }

    _onLoad(reader, deferred, scope) {
        return () => {
            scope.$apply(() => {
                deferred.resolve(reader.result);
            });
        };
    }

    _getReader(deferred, scope) {
        const reader = new FileReader();
        reader.onload = this._onLoad(reader, deferred, scope);
        return reader;
    }

    readAsDataURL(file, scope) {
        const deferred = this.$q.defer();
        const reader = this._getReader(deferred, scope);
        reader.readAsDataURL(file);
        return deferred.promise;
    }

}

FileReaderService.$inject = ['$q'];

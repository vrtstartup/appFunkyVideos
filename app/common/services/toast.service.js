export default class toastService {
    constructor($mdToast) {
        this.$mdToast = $mdToast;
    }

    showToast(type, text) {
        this.$mdToast.show(
            this.$mdToast.simple()
                .textContent(text)
                .position('top right' )
                .hideDelay(3000)
        );
    }
}

toastService.$inject = ['$mdToast'];

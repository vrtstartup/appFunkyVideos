export default class toastService {
    constructor($mdToast) {
        this.$mdToast = $mdToast;
    }

    showToast(type, text) {
        this.$mdToast.show({
            template: '<md-toast class="md-toast ' + type +'">' + text + '</md-toast>',
            hideDelay: 99999999,
            position: 'bottom right'
        });
    }
}

toastService.$inject = ['$mdToast'];

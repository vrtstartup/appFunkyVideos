export default class VideoGenerationService {
    constructor($log, $http, FileSaver, canvasUtil, $q) {
        this.$http = $http;
        this.$log = $log;
        this.$q = $q;
        this.FileSaver = FileSaver;
        this.canvasUtil = canvasUtil;
    }

    takeScreenshot(element, isTemplate) {

        let contentType = 'image/jpeg';
        if (isTemplate) {
            contentType = 'image/png';
        }

        return this.canvasUtil
            .fromHtml(element)
            .then(canvas => {
                return this.canvasUtil.toImage(canvas, contentType);
            })
            .then(image => {
                if (isTemplate) {
                    return this._userUpload(image);
                } else {
                    return this._upload(image, contentType);
                }
            })
    };

    _time() {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let hours = today.getHours();
        let minutes = today.getMinutes();
        let seconds = today.getSeconds();
        let yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        let date = yyyy + mm + dd + '_' + hours + minutes + seconds;
        return date;
    }


    _userUpload(data) {
        this.FileSaver.saveAs(data, 'image-' + this._time() + '.png');
        return this.$q.when(null);
    };

    _upload(data, contentType) {

        return this.$http({
                method: 'POST',
                url: '/api/templates',
                headers: {
                    'Content-Type': contentType
                },
                data: data,
                transformRequest: []
            })
            .then((response) => {
                this.$log.info('image uploaded', response.data);
                return response.data.template_url;
            })
            .catch((err) => {
                this.$log.error('upload error', err);
                throw err;
            });
    };
}


VideoGenerationService.$inject = ['$log', '$http', 'FileSaver', 'canvasUtil', '$q'];
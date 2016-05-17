export default class VideoGenerationService {
    constructor($log, $http, FileSaver, canvasUtil, $q) {
        this.$http       = $http;
        this.$log        = $log;
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

    _userUpload(data) {
        this.FileSaver.saveAs(data, 'template.png');
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
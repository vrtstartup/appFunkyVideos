
export default class VideoUploaderService {
    constructor($log, $http) {

        this.$http = $http;
        this.$log  = $log;

        this.upload = function(data) {
            this.$http({
                    method: 'POST',
                    url: '/api/subtitleVideos',
                    headers: {
                        'Content-Type': 'video/*'
                    },
                    data: data,
                    transformRequest: []
                })
                .success(() => {
                    this.$log.info('video uploaded');
                })
                .error((err) => {
                    this.$log.error('upload error', err);
                });
        };


    }
}

VideoUploaderService.$inject = ['$log', '$http'];

export default class VideoUploaderService {
    constructor($log, $http) {

        this.$http = $http;
        this.$log  = $log;

        this.upload = function(data) {
            console.log(data);
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
                    console.log('success');
                })
                .error((err) => {
                    this.$log.error('upload error', err);
                    console.log('no success');
                });
        };


    }
}

VideoUploaderService.$inject = ['$log', '$http'];
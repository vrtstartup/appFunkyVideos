export default function httpErrorInterceptor($q, toast) {
    return {
        responseError: function(response) {
            console.log(response.status);
            return q.reject(response);
        }
    }
}

httpErrorInterceptor.$inject = ['$q', 'toast'];
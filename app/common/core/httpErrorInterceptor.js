export default function httpErrorInterceptor($q, $rootScope) {
    return {
        'responseError': function(response) {
            var errorMessage = 'An unexpected error has occurred. Please try again.';

            if(response.status === 404) {
                errorMessage = 'Page not found';
            }

            if(response.status >= 500) {
                errorMessage = 'Something went wrong on the server';
            }

            $rootScope.$broadcast('httpError', {status: response.status, message: errorMessage});
            return $q.reject(response);
        }
    }
}

httpErrorInterceptor.$inject = ['$q', '$rootScope'];
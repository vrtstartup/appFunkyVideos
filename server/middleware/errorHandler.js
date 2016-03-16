'use strict';

var Boom = require('boom');

module.exports = function() {
    return function errorHandler(err, req, res, next) {
        let error = err;

        if (!(error instanceof Error)) {
            error = new Error(err);
        }

        console.warn('Error: ' + error.message);

        const status = error.statusCode || error.status;
        Boom.wrap(error, status);
        error.reformat();

        if (error.output.statusCode === 500) {
            console.warn('Stack: ' + error.stack);
        }

        return res.set(error.output.headers)
            .status(error.output.statusCode)
            .send(error.output.payload);
    };
};
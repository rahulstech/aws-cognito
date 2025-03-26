const types = require('node:util/types');
const http = require('node:http');
const { pickOnly } = require('./utils');

function catchError(fn) {
    let handler = fn;
    if (!types.isAsyncFunction(fn)) {
        handler = async (req,res,next) => {
            fn(req,res,next);
        }
    }
    return (req, res, next) => {
        handler(req,res,next)
        .catch(error => next(error))
    }
}

class AppError extends Error {

    constructor(statusCode, reason = null, isOperational = true, stack = '') {
        super()
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.stack = stack;
        if (typeof reason === 'string') {
            this.reason = { description: reason };
        }
        else if (typeof reason === 'object') {
            this.reason = pickOnly(reason, ['description','context', 'details']);
        } 
        else {
            this.reason = { description: http.STATUS_CODES[statusCode] };
        }
    }

    static fromError(error, isOperational = true, statusCode = 500) {
        const orgStack = error.stack;
        error.stack = null;
        return new AppError(statusCode,{ description: error.message, context: { ...error } }, isOperational, orgStack);
    }
}

module.exports = { catchError, AppError, }
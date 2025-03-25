const types = require('node:util/types');
const http = require('node:http');
const { describe } = require('node:test');
const { pickOnly } = require('./utils');

function catchError(fn) {
    let handler = fn;
    if (!types.isAsyncFunction(fn)) {
        handler = async (req,res,next) => fn(req,res,next);
    }
    return (req, res, next) => {
        handler(req,res,next)
        .catch( error => {
            next(error);
        })
    }
}

class AppError extends Error {

    constructor(statusCode, reason = null, isOperational = true, stack = '') {
        super()
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (typeof reason === 'string') {
            this.reason = { description: reason };
        }
        else if (typeof reason === 'object' && reason.constructor === Object) {
            this.reason = pickOnly(reason, ['description','context', 'details']);
        } 
        else {
            this.reason = { description: http.STATUS_CODES[statusCode] };
        }
        if (stack) {
            this.stack = stack;
        }
    }
}

module.exports = { catchError, AppError, }
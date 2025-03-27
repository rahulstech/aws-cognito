const winston = require('winston');
const { transports } = winston;
const { combine, uncolorize, printf } = winston.format;

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL,
    transports: [
        new transports.Console({
            format: combine(
                uncolorize(),
                printf( info => {
                    if (process.env.NODE_ENV === 'production') {
                        const { stack, ...withoutStacktrace } = info;
                        return JSON.stringify(withoutStacktrace);
                    }
                    return JSON.stringify(info);
                })
            )
        })
    ]
})

module.exports = { logger }
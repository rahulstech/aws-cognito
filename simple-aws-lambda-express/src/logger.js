const winston = require('winston');
const { transports } = winston;

const Logger = winston.createLogger({
    level: "info",
    transports: [
        new transports.Console({
            
        })
    ]
})
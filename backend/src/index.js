const { AppError } = require('./errors');
const { logger } = require('./logger');
const { app } = require('./server');
const serverless = require('serverless-http');

function handleUnhandledError(error) {
    logger.error('[Unhandled]', error);
    process.exit(1);
}

process.on('uncaughtException', handleUnhandledError)

process.on('unhandledRejection', handleUnhandledError)

app.listen(3000, () => console.log('server listening on port 3000'));

// modules.export.handler = serverless(app);

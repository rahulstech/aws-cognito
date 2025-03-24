const { app } = require('./server');
const serverless = require('serverless-http');

// modules.export.handler = serverless(app);

app.listen(3000, () => console.log('server listening on port 3000'));

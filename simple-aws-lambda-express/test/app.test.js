const { app } = require('../src/app');
const { createServer } = require('node:http');

const server = createServer(app);

server.listen(3000, () => console.log('server started at port 3000'));
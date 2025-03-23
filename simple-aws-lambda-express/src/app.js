const express = require('express');

const server = express();

// this environment variable was set in lambda configuration
const APP_NAME = process.env.APP_NAME || 'unkown-app';

const routes = express.Router();

routes.use(express.json());

routes.get('/',(req,res)=>{
    res.send(`hello from server. this is the basic response for ${APP_NAME}`);
});

routes.post('/echo',  (req,res) => {
    const { name } = req.body;
    res.send(`Hello ${name} this is an echo endpoint on ${APP_NAME}`)
});

routes.get('/search', (req,res) => {
    const { country } = req.query;
    res.send(`your search result for country = ${country} from ${APP_NAME}`);
});

// invoke url given by AWS API Gateways
// https://<api id>.execute-api.<api region>.amazonaws.com
//
// when dev stage is used then use this base url
// https://<api id>.execute-api.<api region>.amazonaws.com/dev
// NOTE: there is a route GET /
// to reach this endpoint i need to invoke the following url
// https://<api id>.execute-api.<api region>.amazonaws.com/dev/ <- note the ending /, it i required
//
// when $default stage is used then use this base url
// https://<api id>.execute-api.<api region>.amazonaws.com
//
// i can define one or more stages. but $default stage to get rid of the unnecessary stage specific path
// in invoke url. 
// stages and routes are different. all stages have same routes. stage is used different testing scenarios

server.use('/dev', routes);

server.use('/', routes);


module.exports = { app: server };
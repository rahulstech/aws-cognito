const serverless = require("serverless-http");
const { app } = require('./src/app');


// by default aws search for handler function inside index.mjs
// if the handler function is in different file i.e. module then change it
// to change handler function:
// goto AWS Lambda > choose region and choose lambda function > goto "Runtime Settings" > "Edit" and change "Handler"
// for example handler is in serverles.js and this file is inside src dir then "Handler" should be
// src/serverless.handler

// serverless-http helps to transform a lambda event into http request
exports.handler = serverless(app);

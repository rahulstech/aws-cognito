const express = require('express');
const { signup, resendSignupCode, verifySignup, login } = require('./cognito');

const app = express();

app.use(express.json());

app.post('/signup', async (req,res) => {
    const { email, password, name } = req.body;
    await signup({ email, password, name });
    res.sendStatus(204);
})

app.get('/signup/verify', async (req,res) => {
    const { code, email } = req.query;
    await verifySignup(email, code);
    res.sendStatus(200);
})

app.post('/signup/code', async (req,res) => {
    const { email } = req.body;
    await resendSignupCode(email);
    res.sendStatus(200);
})

app.post('/login', async (req,res) => {
    const { email, password } = req.body;
    
    await login({ email, password });
    res.sendStatus(200);
})

// error handler

app.use((error, req, res, next) => {
    console.log(error);
    res.sendStatus(500);
})


module.exports = { app }
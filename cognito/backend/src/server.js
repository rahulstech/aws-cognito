const express = require('express');
const { signup, resendSignupCode, verifySignup, 
    login, requestResetPassword, resetPassword, changeEmail, verifyEmail, refreshAccessToken } = require('./cognito');

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

// it will receive the email from use and send a code to the email, later user have to use the code to set new password
app.post('/login/forgotpassword', async (req,res) => {
    const { email } = req.body;
    await requestResetPassword(email);
    res.sendStatus(200);
})

// it will receive the email, the code and the new password and change the password
app.patch('/login/resetpassword', async (req, res) => {
    const { email, code, newPassword } = req.body;
    await resetPassword({ email, code, newPassword });
    res.sendStatus(200);
})

app.patch('/profile/update/email', async (req,res) => {
    // get the bearer token from header
    const authorization = req.headers.authorization
    const bearer = authorization.slice(7);

    // get the new email from body
    const { newEmail } = req.body;

    // perform email update
    await changeEmail(bearer, newEmail);

    res.sendStatus(200);
})

app.get('/profile/verify/email', async (req, res) => {
    // get the bearer token from header
    const authorization = req.headers.authorization
    const bearer = authorization.slice(7);

    // get the new email from body
    const { code } = req.query;

    // perform email update
    await verifyEmail(bearer, code);

    res.sendStatus(200);
})

app.post('/refreshtoken', async (req,res) => {
    const { refreshToken } = req.body;
    await refreshAccessToken(refreshToken);
    res.sendStatus(200);
})

// error handler

app.use((error, req, res, next) => {
    console.log(error);
    res.sendStatus(500);
})


module.exports = { app }
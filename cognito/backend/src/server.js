const express = require('express');
const cors = require('cors');
const { signup, resendSignupCode, verifySignup, 
    login, requestResetPassword, resetPassword, changeEmail, verifyEmail, refreshAccessToken } = require('./cognito');
const { catchError, AppError } = require('./errors');
const { jwtDecode, pickOnly, } = require('./utils');

const app = express();

app.use(cors({
    origin: '*',
}));

app.use(express.json());

app.post('/signup', 
    catchError( async (req,res) => {
        const { email, password, name } = req.body;
        const user_id = await signup({ email, password, name });
        res.sendStatus(204);
    })
)

app.post('/signup/verify', 
    catchError(async (req,res) => {
        const { code, email } = req.body;
        await verifySignup(email, code);
        res.sendStatus(200);
    })
)

app.post('/signup/code',
    catchError(async (req,res) => {
        const { email } = req.body;
        await resendSignupCode(email);
        res.sendStatus(200);
    })
)

app.post('/login', 
    catchError(async (req,res) => {
        const { email, password } = req.body;
        const { AccessToken, IdToken, RefreshToken } = await login({ email, password });
        const { exp: accessTokenExpiry } = jwtDecode(AccessToken);
        const { sub, name, email_verified } = jwtDecode(IdToken);
    
        res.json({
            "access-token": AccessToken,
            "access-token-expire": accessTokenExpiry,
            "refresh-tokens": RefreshToken,
            user: {
                user_id: sub,
                email,email_verified,
                name,
            }
        });
    })
)

// it will receive the email from use and send a code to the email, later user have to use the code to set new password
app.post('/login/forgotpassword', 
    catchError(async (req,res) => {
        const { email } = req.body;
        await requestResetPassword(email);
        res.sendStatus(200);
    })
)

// it will receive the email, the code and the new password and change the password
app.patch('/login/resetpassword', 
    catchError(async (req, res) => {
        const { email, code, newPassword } = req.body;
        await resetPassword({ email, code, newPassword });
        res.sendStatus(200);
    })
)

app.post('/refreshtoken', 
    catchError(async (req,res) => {
        const { refreshToken } = req.body;
        const { AccessToken } = await refreshAccessToken(refreshToken);
        const { exp } = jwtDecode(AccessToken);
        res.json({
            "access-token": {
                token: AccessToken,
                expire: exp,
            }
        })
    })
)

// protected routes

const profileRouter = express.Router();

profileRouter.use(async (req,res,next) => {
    const authorizationHeader = req.headers?.authorization;
    if (authorizationHeader) {
        const str = authorizationHeader.slice(0, 6);
        if (str && str.toLowerCase() === 'bearer') {
            const bearerToken = authorizationHeader.slice(7);
            req.bearerToken = bearerToken;
            return next();
        }
    }
    next(new AppError(401));
});

profileRouter.patch('/update/email', 
    catchError(async (req,res) => {
        // get the bearer token from header
        const bearerToken = req.bearerToken;

        // get the new email from body
        const { newEmail } = req.body;

        // perform email update
        await changeEmail(bearerToken, newEmail);

        res.sendStatus(200);
    })
)

profileRouter.get('/verify/email', 
    catchError(async (req, res) => {
        // get the bearer token from header
        const bearerToken = req.bearerToken;

        // get the new email from body
        const { code } = req.query;

        // perform email update
        await verifyEmail(bearerToken, code);

        res.sendStatus(200);
    })
)

app.use('/profile', profileRouter);

// error handler

// convert the cognito error
app.use((error, req, res, next) => {
    const name = error.__type;
    let errorObj = error;
    // TODO: better handle errors; currently context and details is not best describing 
    switch(name) {
        case 'ExpiredCodeException': {
            errorObj = new AppError(400,'code expired');
        }
        break;
        case 'CodeMismatchException': {
            errorObj = new AppError(400, 'incorrect code');
        }
        break;
        case 'UserNotFoundException': {
            errorObj = new AppError(404, 'incorrect email');
        }
        break;
        case 'NotAuthorizedException': {
            errorObj = new AppError(401, 'incorrect password');
        }
        break;
        case 'InvalidPrameterException': {
            errorObj = new AppError(500,{ context: error });
        }
        break;
        case 'SerializationException': {
            errorObj = new AppError(500, { context: error })
        }
    }
    next(errorObj);
})

// convert other known errors
app.use((error, req, res, next) => {
    const name = error.name;
    let errorObj = error;
    if (name === 'InvalidTokenError') {
        errorObj = new AppError(500, error.message);
    }
    next(errorObj);
})

app.use((error, req, res, next) => {
    const requestContext = { 'http-method': req.method, 'http-path': req.url };
    console.log( requestContext , error);

    if (error.name === 'AppError') {
        const statusCode = error.statusCode;
        if (statusCode >= 500 && statusCode < 600) {
            // don't send details of server side errors
            res.sendStatus(statusCode);
        }
        else {
            // other than server side error send description and details only
            const message = pickOnly(error.reason, ['description', 'details'], false);
            res.status(statusCode).json(message);
        }
    }
    else {
        res.sendStatus(500);
    }
})


module.exports = { app }
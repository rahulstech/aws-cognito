const express = require('express');
const cors = require('cors');
const { signup, resendSignupCode, verifySignup, 
    login, requestResetPassword, resetPassword, changeEmail, verifyEmail, refreshAccessToken, 
    resendEmailCode} = require('./cognito');
const { catchError, AppError } = require('./errors');
const { jwtDecode, pickOnly, } = require('./utils');
const { logger } = require('./logger');
const { validate, signupSchemas, verifySignupSchemas, resendSignupCodeSchemas, loginSchema, forgetPasswordSchemas, resetPasswordSchemas, updateEmailSchema, refreshTokenSchemas, verifyEmailSchemas } = require('./validation');

const app = express();

app.use(cors({
    origin: '*',
}));

app.use(express.json());

// create new use using email, password and full name
app.post('/signup', 
    catchError(validate(signupSchemas)),
    catchError( async (req,res) => {
        const { email, password, name } = req.body;
        await signup({ email, password, name });
        res.status(204).json();
    })
)

// verify signup using the code sent via registered email
app.post('/signup/verify', 
    catchError(validate(verifySignupSchemas)),
    catchError(async (req,res) => {
        const { code, email } = req.body;
        await verifySignup(email, code);
        res.json();
    })
)

// if signup is not confirmed and signup confirmation code expires request a new code
app.post('/signup/code',
    catchError(validate(resendSignupCodeSchemas)),
    catchError(async (req,res) => {
        const { email } = req.body;
        await resendSignupCode(email);
        res.json();
    })
)

app.post('/login', 
    catchError(validate(loginSchema)),
    catchError(async (req,res) => {
        const { email, password } = req.body;
        const { AccessToken, IdToken, RefreshToken } = await login({ email, password });
        const { exp: accessTokenExpiry } = jwtDecode(AccessToken);
        const { sub, name, email_verified } = jwtDecode(IdToken);
    
        res.json({
            "access-token": AccessToken,
            "access-token-expire": accessTokenExpiry,
            "refresh-token": RefreshToken,
            user: {
                user_id: sub,
                email,email_verified,
                name,
            }
        });
    })
)

// it will receive the email from user and send a code to the email, later user have to use the code to set new password
app.post('/login/forgotpassword', 
    catchError(validate(forgetPasswordSchemas)),
    catchError(async (req,res) => {
        const { email } = req.body;
        await requestResetPassword(email);
        res.json();
    })
)

// it will receive the email, the code and the new password and change the old password
app.patch('/login/resetpassword', 
    catchError(validate(resetPasswordSchemas)),
    catchError(async (req, res) => {
        const { email, code, newPassword } = req.body;
        await resetPassword({ email, code, newPassword });
        res.json();
    })
)

// issue new access token using the provided refresh token
app.post('/refreshtoken', 
    catchError(validate(refreshTokenSchemas)),
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

// change current email, a confirmation code is sent to the new email
profileRouter.patch('/update/email', 
    catchError(validate(updateEmailSchema)),
    catchError(async (req,res) => {
        // get the bearer token from header
        const bearerToken = req.bearerToken;

        // get the new email from body
        const { newEmail } = req.body;

        // perform email update
        await changeEmail(bearerToken, newEmail);
        
        res.json();
    })
)

// resend the email verification code
profileRouter.get('/update/email/code', 
    catchError(async (req,res) => {
        // get bearer token
        const bearerToken = req.bearerToken;

        // requent cognito for new email verification code
        await resendEmailCode(bearerToken);
        
        res.json();
    })
)

// verify the new email with code sent to this email
profileRouter.get('/verify/email', 
    catchError(validate(verifyEmailSchemas)),
    catchError(async (req, res) => {
        // get the bearer token from header
        const bearerToken = req.bearerToken;

        // get the new email from body
        const { code } = req.query;

        // perform email update
        await verifyEmail(bearerToken, code);

        res.json();
    })
)

app.use('/profile', profileRouter);

// error handlers

// convert the cognito error
app.use((error, req, res, next) => {
    const type = error.__type;
    let errorObj = error;
    switch(type) {
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
        case 'AliasExistsException':
        case 'UsernameExistsException': {
            errorObj = new AppError(403, 'email exists');
        }
        break;
        case 'UserNotConfirmedException': {
            errorObj = new AppError(403, 'user not confirmed');
        }
        break;
        case 'NotAuthorizedException': {
            errorObj = new AppError(401);
        }
        break;
        case 'InvalidPrameterException': {
            errorObj = new AppError(500,error.message, false);
        }
        break;
        case 'SerializationException': {
            errorObj = new AppError(500, error.message, false);
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
    const errorObj = error.name === 'AppError' ? error : AppError.fromError(error, false, 500);
    const statusCode = errorObj.statusCode;

    logger.error('[ApiError]',  errorObj, requestContext);
    if (statusCode >= 500 && statusCode < 600) {
        // don't send details for server side errors
        res.json();
    }
    else {
        // other than server side error send description and details only
        const message = pickOnly(errorObj.reason, ['description', 'details'], false);
        res.status(statusCode).json(message);
    }

    if (!errorObj.isOperational) {
        process.exit(1);
    }
})


module.exports = { app }
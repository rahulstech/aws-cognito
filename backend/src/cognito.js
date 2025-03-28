const { CognitoIdentityProviderClient, 
    SignUpCommand, ConfirmSignUpCommand, ResendConfirmationCodeCommand, 
    InitiateAuthCommand, ForgotPasswordCommand, ConfirmForgotPasswordCommand,
    UpdateUserAttributesCommand, VerifyUserAttributeCommand,
    GetUserAttributeVerificationCodeCommand,
    GetUserCommand,
} =  require('@aws-sdk/client-cognito-identity-provider');


const cognito = new CognitoIdentityProviderClient({
    region: process.env.COGNITO_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
    },
});

async function signup({ email, password, name }) {
    const cmd = new SignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
        UserAttributes: [
            { Name: 'email', Value: email },
            { Name: 'name', Value: name },
        ],
    });

    // send sigup command to cognito
    const res = await cognito.send(cmd);

    // return user_id
    return res.UserSub;
}

async function verifySignup(email, code) {
    const cmd = new ConfirmSignUpCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
    });

    await cognito.send(cmd);
}

async function resendSignupCode(email) {
    const cmd = new ResendConfirmationCodeCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
    });

    await cognito.send(cmd);
}

async function login({ email, password }) {
    const cmd = new InitiateAuthCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthFlow: 'USER_PASSWORD_AUTH', // enable AUTH_USER_PASSWORD_AUTH in Auth Client in Aws Cognito User Pool
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password
        }
    });
    
    const { AuthenticationResult } = await cognito.send(cmd);
    return AuthenticationResult;
}

async function requestResetPassword(email) {
    const cmd = new ForgotPasswordCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
    });
    
    await cognito.send(cmd);
}

async function resetPassword({ email, code, newPassword }) {
    const cmd = new ConfirmForgotPasswordCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
        Password: newPassword
    });

    await cognito.send(cmd);
}

async function changeEmail(accessToken, newEmail) {
    const cmd = new UpdateUserAttributesCommand({
        AccessToken: accessToken,
        UserAttributes: [
            { Name: 'email', Value: newEmail }
        ]
    });

    await cognito.send(cmd);
}

async function resendEmailCode(accessToken) {
    const cmd = new GetUserAttributeVerificationCodeCommand({
        AccessToken: accessToken,
        AttributeName: 'email'
    })

    await cognito.send(cmd);
}

async function verifyEmail(accessToken, code) {
    const cmd = new VerifyUserAttributeCommand({
        AccessToken: accessToken,
        AttributeName: 'email',
        Code: code,
    })

    await cognito.send(cmd);
}

async function updateUser(accessToken, data) {
    const attributes = Object.entries(data).map(([k,v]) => ({ Name: k, Value: v }));
    const cmd = new UpdateUserAttributesCommand({
        AccessToken: accessToken,
        UserAttributes: attributes,
    });

    await cognito.send(cmd);
}

async function getUserDetails(accessToken) {
    const cmd = new GetUserCommand({
        AccessToken: accessToken,
    });

    return await cognito.send(cmd);
}

// generte new access and id token using refresh token
// to generate access token cognito client must have ALLOW_REFrESH_TOKEN_AUTH auth flow permission which is allowed by default
async function refreshAccessToken(refreshToken) {
    const cmd = new InitiateAuthCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters: {
            REFRESH_TOKEN: refreshToken,
        }
    });

    const { AuthenticationResult } = await cognito.send(cmd);
    return AuthenticationResult;
}

module.exports = {
    signup, verifySignup, resendSignupCode, login, requestResetPassword, resetPassword, changeEmail, verifyEmail, refreshAccessToken,
    resendEmailCode, updateUser, getUserDetails, 
}
const { CognitoIdentityProviderClient, 
    SignUpCommand, ConfirmSignUpCommand, ResendConfirmationCodeCommand, 
    InitiateAuthCommand, ForgotPasswordCommand, ConfirmForgotPasswordCommand,
    UpdateUserAttributesCommand, VerifyUserAttributeCommand,
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

    /**
     * sample response
     * {
        '$metadata': {
            httpStatusCode: 200,
            requestId: 'e9713296-52ce-4453-8f71-d4217067a7f6',
            extendedRequestId: undefined,
            cfId: undefined,
            attempts: 1,
            totalRetryDelay: 0
        },
        CodeDeliveryDetails: {
            AttributeName: 'email',
            DeliveryMedium: 'EMAIL',
            Destination: 'r***@g***'
        },
        Session: 'AYABeKsDch5Ap0fDjKy2dB5MQIkAHQABAAdTZXJ2aWNlABBDb2duaXRvVXNlclBvb2xzAAEAB2F3cy1rbXMATGFybjphd3M6a21zOmFwLXNvdXRoLTE6NjU0NDM0NDQ0NzkwOmtleS8yNjg1NWU1NC05NTMzLTRhNDctYjYxNy1hYjgwYjMyNDkxZWQAuAECAQB4-BeuO0GV5N2J8dmVTJfc71G3DuEJOFQLLLNY6cqgxKkBV_NL16jSGly9G-6qZ8wYDQAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDB1M0B-ey9m5xZAoHwIBEIA7TO6wwpl0T5F-kZJQlarVgyhs_ul9p4BH3iA-f9B3aNREeTj1ktlCjkf9KucimctWMKp1vOgEwvjRjMECAAAAAAwAABAAAAAAAAAAAAAAAAAA8FF3xLClB0oBMlmOWLlyd_____8AAAABAAAAAAAAAAAAAAABAAABXDR5JYg28iOOxdsg5qMBuYNzcI1HHrakPUjP77ViHsx99nKvpqj6YNp85lgzw9B7YoXxjGJBrhEYlWuHf7wE5RBbOA9V60sF0GCRFpFNvUyfkf8l4JTAPyAC1xCfVxjK5sAhDl2W5GThX_AaA18xlST3fL-jr16OUvzzMloz45Cx7Dtd0r704mLiYdMJnYhTVO5ASGSl2f9-r3goqGDr2wG6Eu7dEonBtHbGLMqSq2lKbBmo77NKMrntWMiYxTyuU1JOfneb6cQf10ZsGs_0D22JT53C44smOGl2nsWBSmwv9SZD4ivXKzUzUXHVW1k1mJBFUxvAKFN2g_Y83-19JIYeQLJhZELQ3nFFWrH76TM7-XEnhdVhi-siDC7yo1_yDQAN8QsG6d1rSGVEZ1rAUGXK1M-tlneR4638mwI_U1Urz5fVsuPPbwdekak5j0W6lUIq-BMjkzzmp5g9czZRMnPAz1vcfe7QZsEBMm0',
        UserConfirmed: false,
        UserSub: '81b3fd7a-3031-704d-502f-6e1bd24f904e'
        }
        */

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

    /**
     * successful signup verified
     * { '$metadata': {
            httpStatusCode: 200,
            requestId: '13d7089f-14c6-4f3f-b4af-63941df5a7f6',
            extendedRequestId: undefined,
            cfId: undefined,
            attempts: 1,
            totalRetryDelay: 0
        },
        Session: 'AYABeGauQVB5LL3LPK85TY4gE4MAHQABAAdTZXJ2aWNlABBDb2duaXRvVXNlclBvb2xzAAEAB2F3cy1rbXMATGFybjphd3M6a21zOmFwLXNvdXRoLTE6NjU0NDM0NDQ0NzkwOmtleS8yNjg1NWU1NC05NTMzLTRhNDctYjYxNy1hYjgwYjMyNDkxZWQAuAECAQB4-BeuO0GV5N2J8dmVTJfc71G3DuEJOFQLLLNY6cqgxKkBMVI6NXW5PhAYL1Cndn1jUAAAAH4wfAYJKoZIhvcNAQcGoG8wbQIBADBoBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDKIJ-cEjwaV6AqnrzwIBEIA71PNjJfFTZaXDYvjGB5aFkgFAXqAVBngV55Sj2_3H1ZjGhxAr_kXQwW1GSaAX9_4kegvCPobJY6-OYaoCAAAAAAwAABAAAAAAAAAAAAAAAAAATaSIP8Dz7ldCfIa4RaTZDf____8AAAABAAAAAAAAAAAAAAABAAABZJizWMuRjmtjWfR8fXUOS66m4W0i4SEH7IRiGKGFg0NYoNkpEYyg37rwAAR4xIZ0XfLGB-YMU9j9if8naMzM2_LUCDd2Yl6ee7kXCWrLcGGKTBgs98RqvYbWSRlxdshGIf3WQKKJ-M0-SC_534Z3b09Irb1Qz0sHW93vQcIA-XoKKBqIufrIGa9TO2q9uV7y1nwl0RhvTaKQ5-TNeI1aAAkT6cEPo7CwpsOhio39hA_ZaUvhJqQrDKpzXQwHlyQDn_ItIZN5bCpn6fhhiHYIUy5bIKFIorEqdRn-jG0ZYkQXg74CNCQ2Egr89YNaIhanjLCex319vHOYqpeFWsg9SfeYW80Olk9L13RnMO2xP9qS71UCz9UiBHyq1JER4agdE4gJWioGw6rREasbVXCvHgLwTPVJN0-4Rwax2JgZSwaKq5iWln77QVxlLOr1l7I5WPxrEmwSqQ3aFgt9E64FxRpU8UbYWRIAFvmX-VzM-MAkpk0YbQ'
        }
     * 
     * 
     * 
     * sample error
     * {
     *      $metadata': {
                httpStatusCode: 400,
                requestId: '32261243-6216-454c-9450-49d682711e6f',
                extendedRequestId: undefined,
                cfId: undefined,
                attempts: 1,
                totalRetryDelay: 0
            },
            __type: 'ExpiredCodeException'
        }
    */

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
        // enable AUTH_USER_PASSWORD_AUTH in Auth Client in Aws Cognito User Pool
        AuthFlow: 'USER_PASSWORD_AUTH', 
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password
        }
    });

    /**
     * success response 
     * {
        '$metadata': {
            httpStatusCode: 200,
            requestId: 'b4e11e8e-4d40-4968-a694-99503787f762',
            extendedRequestId: undefined,
            cfId: undefined,
            attempts: 1,
            totalRetryDelay: 0
        },
        AuthenticationResult: {
            AccessToken: 'eyJraWQiOiJoSGNHWk1CeHlXMWxcL05hcU1QcHlNeWhMYzM1SWsxKzdvWmpPK2k5SCtDVT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0MTkzZWQxYS0xMGYxLTcwMWEtYzBhZi00ZDEzNzQ0YWIyYWEiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGgtMS5hbWF6b25hd3MuY29tXC9hcC1zb3V0aC0xXzBTampZbUFBUCIsImNsaWVudF9pZCI6IjViZzJnNWsyajZrZ2ZsM3Uwdm1ub2xyZ3Z0Iiwib3JpZ2luX2p0aSI6ImFiNGYyY2ZjLTA5MDItNDUyMy1iZTE1LTYxODI0MDdmMDlhZiIsImV2ZW50X2lkIjoiYjRlMTFlOGUtNGQ0MC00OTY4LWE2OTQtOTk1MDM3ODdmNzYyIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc0Mjg0OTE0NCwiZXhwIjoxNzQyODUyNzQ0LCJpYXQiOjE3NDI4NDkxNDQsImp0aSI6ImVhYjA1ODYzLTdhMGUtNGFkYy04NDk3LWM3MDBmMDVhYmU2ZiIsInVzZXJuYW1lIjoiNDE5M2VkMWEtMTBmMS03MDFhLWMwYWYtNGQxMzc0NGFiMmFhIn0.YqYcSGWN7l9AXzQhnsdU1YGXKXKdyeQycHm9c0IsCUhVffTqBqoMZALE5LuArB2Z-4v9zjerwJWV0OqfQemmyW7LbbGOyTYOonRq7DPTxKBts0RhTwrutgXQt4Us378TJfYFToo_7XXycfIosTaunSSLvwEDTDFrWvDSfhMa-2CfrKBl_UPws7jEInzuYWBplQpLy_LqL4k1U6NPaamLWzPCz-57klNmKB2KKclRFeekQS2EF0hKJv16H72VQjxgHFimdjWokhyJ9gJjPgXkWxuemFQ1431Vr8huz7CNCZH5iZtrShsYTqbdAjL3fcGXLsuVvxhcYkGNJ70I9TBqcw',
            ExpiresIn: 3600,
            IdToken: 'eyJraWQiOiJ2Y0VEVitNRE9kRWVaMnlNeUlMTVFidXRjMjJjclZzdGJyb2tMQ0FwdkVzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI0MTkzZWQxYS0xMGYxLTcwMWEtYzBhZi00ZDEzNzQ0YWIyYWEiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV8wU2pqWW1BQVAiLCJjb2duaXRvOnVzZXJuYW1lIjoiNDE5M2VkMWEtMTBmMS03MDFhLWMwYWYtNGQxMzc0NGFiMmFhIiwib3JpZ2luX2p0aSI6ImFiNGYyY2ZjLTA5MDItNDUyMy1iZTE1LTYxODI0MDdmMDlhZiIsImF1ZCI6IjViZzJnNWsyajZrZ2ZsM3Uwdm1ub2xyZ3Z0IiwiZXZlbnRfaWQiOiJiNGUxMWU4ZS00ZDQwLTQ5NjgtYTY5NC05OTUwMzc4N2Y3NjIiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc0Mjg0OTE0NCwibmFtZSI6IlJhaHVsIiwiZXhwIjoxNzQyODUyNzQ0LCJpYXQiOjE3NDI4NDkxNDQsImp0aSI6Ijc2ZjA1MTFlLTM3NjItNDg5MS1hMjRjLWI4OGQ0NjI3MDI0ZiIsImVtYWlsIjoicmFodWxiYWdjaGkwNEBnbWFpbC5jb20ifQ.KESDdZAVevz978bJIms88Zshq_F8GQf9rE1UR00tk4K4IY5cf2vYv8TRZ6rdQZbdoJD5DLdgWFhzV7mcYMhSy65kK4vESkUU8NkoYjvjxJJxrNurWQ6veRi2UAYChkU1UAtgFOFJvkDxWrPR_Mo0L49IMaSCpwmLKf5WpJ8D6LRN5LqAqtkwVZ-BgGXpfppxc2slid7SlxfMrw04HavACMA6iJyUJWEGUoyTg4GuxqphbeQovZiQytyetuZ6Qttn6bljqcCrQMI7OMmfmeWY6UZ_rdBV3cIiD9v4VWTXIUa7RmAErZwJJvFuFb7fgxeU-Ky4jKS7Hl6H03DCQgSpQQ',
            RefreshToken: 'eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.otW2GJ_MKUuRdubXVqV4BgXXUoanPfYTsvJ-5-LF8Dy1UAgpncYwZso6o9Jgj2pXwGKnoxZp-8aLBcsrjAsmpUy8amMsazOVA-V8z4FaxsjhohjIh6CK2mQ2Y_XLIxKcS2t5lpezti9KSGqsScrtMPg2QvX66HKWWk7282p4BNgqg0sHYDHCzRvQFNdq_M49EeOMBKUe7mGM0vxvq0JjE7B3IagtRzPF9lsowXCbRgsY4ewd4pnXWKJfb_iXLfkSnK7Otup-qURpeh3m6FhthK1BBykTIBojl1hUx8nY7WVRWHpiIjyyVAXI9W_fY2wcV9Djlj1wYuYeiWLNx2_bXA.vaqJmP-Cd1LN3amW.mn3gVUrx_aKR1XE_6JQhYRzuQxvXB4RdyB5CncRZWN7p4mEzUOehZRHU0enq8iIrTiNvkLAN8yWG7YJGE9kZMmTYdt_pWURJ7mHkUfLkhJBAnRhyBJWKXX7Cz5d3tzkJ_2je8pSEiKBjmglyVA5R5RkJtLtIZzALmqDTsLntyu_wU34v5riPY-pleQo5n4R1XoJO9W-pDCEBCiaglBOLLBBNnyRUXc5RFmDrOW3g6YTYee4ojOrABrfD1mdI1sYe5rviNocHhFB_8W2XVyUfxA2Kew0CHRTa7hbHzA6rKqpcwaY6eECtscOIkRSBG9MR8Q8S4dRaOgZz0LDj09IJmoR_nm77yE18RHug73u4l4Lgu-EQQPw_3c7Ott1dUnsYcYeViaCVAXFWTsAAwKRl62DnfiT4Xk-_jF363WKk49g4JfApXrhfe7rfpbz2_mjW4Pd2NaHDhRGN8MWNWUBGM1HSRyPv4D-HTJ-2qQULRL_yrDPD1NWT-t8UwgJk0473OxU6KUuUj0JgyyweZnka-kMv25qkhyCbfwsz1LaEnv_rAVNCybIu6hA_Px7493Yvz3klCDQvbwofa_r0nyMJAIuaCuVXk6-rtvZNX4aBgC0SfsOOC7i9Nrqy_n5tGQMS2nhlicjrHnHMav28QY0BoIP15ny9QJxXflPWlKYzVhvLb7uBTbalnpNYwOqxM_SLX1NI4-IwxdY63HwbSvhJKWqLcoW5dnjrMJqIH9LdL69FpeGjiyGp2WhnEfHdHhI3dSbffkXnqWe7sxr3Nw-tCkRFkj11nXDt4oXazY7EuBjcHOKYDQvaqIyGyvZm2ea5Q6Os8msrGII5kPNWiWNZDc36fQ1UbsDmX3GmwAqOK4_bjqeT9hfDlrM1a7F5nOypxChH7PY4LEVPNZ2XluNLANUdFq4JOvKn4c7adKK1dEF3y7s7wg7UkNRwB7IX4xGz7zj-SEHbqoix60vE04438HGLiwj45wuxS6q0xatBQFYcX1ex0lGZxaUexg0XXvZNnwaSnrlQv4ec7UmTfUS9L0v-Y-GhuZNyxrRbdeeundW6G44sVm6D2akVJa4EkIIObov283PdlsxamqpoMf0u84W4GQcZ9JlJlcDRAYnlolVkQzmYgZ3_k1SjNevNY-aPnmXemB8GVEfFBrPWdY-KEri1EDBzlOotvjmPNdCYZCHgybZ-ctwNixMPbrKkzQYOPTanzXg35-1jXukpZRaoKMxm1eoYOgGJ25BisFMbwdDSkIvaessZriJOaHITHlJ1-uxHrNrMBcp5qwbvD-nQ-GOLUOemgCXxijjmjjCB2Efma7LzzhOvUaXh8dSJaQ.e8rPRvVbXedORKMRV3bFWg',
            TokenType: 'Bearer'
        },
        ChallengeParameters: {}
        }


     * error types:
     * {
     * __type: 'SomthingException'
     * }
     * 'InvalidParameterException' => malformed login command to cognito, this is serverside error
     * NotAuthorizedException => username password error
     */
    
    const { AuthenticationResult } = await cognito.send(cmd);
    return AuthenticationResult;
}

async function requestResetPassword(email) {
    const cmd = new ForgotPasswordCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
    });
    /**
     * successful response 
     *    {
        '$metadata': {
            httpStatusCode: 200,
            requestId: '50f050e1-03bb-4aba-a9b8-3920469308f1',
            extendedRequestId: undefined,
            cfId: undefined,
            attempts: 1,
            totalRetryDelay: 0
        },
        CodeDeliveryDetails: {
            AttributeName: 'email',
            DeliveryMedium: 'EMAIL',
            Destination: 'r***@g***'
        }
        }
     */
    await cognito.send(cmd);
}

async function resetPassword({ email, code, newPassword }) {
    const cmd = new ConfirmForgotPasswordCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: code,
        Password: newPassword
    });

    /**
     * 
     * error types
        ===========
        CodeMismatchException => incorrect code
        ExpiredCodeException => code expired
        UserNotFoundException => incorrect username (eg: email, phone etc.)
     */
    await cognito.send(cmd);
}

async function changeEmail(accessToken, newEmail) {
    const cmd = new UpdateUserAttributesCommand({
        AccessToken: accessToken,
        UserAttributes: [
            { Name: 'email', Value: newEmail }
        ]
    })
/**
 * {
  '$metadata': {
    httpStatusCode: 200,
    requestId: 'ec046080-07b8-4841-ab31-3f87ddf3b50b',
    extendedRequestId: undefined,
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  CodeDeliveryDetailsList: [
    {
      AttributeName: 'email',
      DeliveryMedium: 'EMAIL',
      Destination: 's***@g***'
    }
  ]
}
 */
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

// generate new access token is current access token has expired, requires refresh token and not expired
// to generate access token cognito client must have ALLOW_REFrESH_TOKEN_AUTH auth flow permission which is allowed by default
async function refreshAccessToken(refreshToken) {
    const cmd = new InitiateAuthCommand({
        ClientId: process.env.COGNITO_CLIENT_ID,
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters: {
            REFRESH_TOKEN: refreshToken,
        }
    });

    /**
     * on success
     * AuthenticationResult: {
        AccessToken: 'eyJraWQiOiJoSGNHWk1CeHlXMWxcL05hcU1QcHlNeWhMYzM1SWsxKzdvWmpPK2k5SCtDVT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0MTkzZWQxYS0xMGYxLTcwMWEtYzBhZi00ZDEzNzQ0YWIyYWEiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGgtMS5hbWF6b25hd3MuY29tXC9hcC1zb3V0aC0xXzBTampZbUFBUCIsImNsaWVudF9pZCI6IjViZzJnNWsyajZrZ2ZsM3Uwdm1ub2xyZ3Z0Iiwib3JpZ2luX2p0aSI6IjU3MDZjZjExLTQzMDMtNDFiMi05ODhjLWM0YzFmZDI2ODI3YiIsImV2ZW50X2lkIjoiOWEzY2I5YjAtODUxZi00OGVkLWE4NTgtZGM4NzJlMjJjMDYzIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc0Mjg3MzkyMCwiZXhwIjoxNzQyODc5NDA4LCJpYXQiOjE3NDI4NzU4MDgsImp0aSI6IjA0ZWY4MTEwLTM1ZjgtNGEzOC04Yjk4LWIwYzczMjAzYzIyOCIsInVzZXJuYW1lIjoiNDE5M2VkMWEtMTBmMS03MDFhLWMwYWYtNGQxMzc0NGFiMmFhIn0.Hx1o69-vCpf7H_m0meIWoFWlrcWTJfyKigg25vewGIHCMzG60W5NJnCTfC3omPSiTpn7Ti3v-K227CiGIPy0f-k3Gi-at4oT34PFG170Vq5ZjcR5Pn4uDBhVstVyRT46VAY1eCdlrOwewqH6C6IOjGTEym0lIjqVwK0deo3lEeBkI4FKmvs35gLq9EEFtBN9VdhC07eJZBN2uczW6qWqxVLtkauAQZ4n-XnhGNlLKw1VlA7LSVrt5PZ82_WzL_ghYZ2OthKySyiVwr1ztIaBVLOgKkAagM2l1VyzqBfygzrJsklzwencX59TXS1XJwlLiJqw7Kne9dCG3-kF4zG7Ug',
        ExpiresIn: 3600,
        IdToken: 'eyJraWQiOiJ2Y0VEVitNRE9kRWVaMnlNeUlMTVFidXRjMjJjclZzdGJyb2tMQ0FwdkVzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI0MTkzZWQxYS0xMGYxLTcwMWEtYzBhZi00ZDEzNzQ0YWIyYWEiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV8wU2pqWW1BQVAiLCJjb2duaXRvOnVzZXJuYW1lIjoiNDE5M2VkMWEtMTBmMS03MDFhLWMwYWYtNGQxMzc0NGFiMmFhIiwib3JpZ2luX2p0aSI6IjU3MDZjZjExLTQzMDMtNDFiMi05ODhjLWM0YzFmZDI2ODI3YiIsImF1ZCI6IjViZzJnNWsyajZrZ2ZsM3Uwdm1ub2xyZ3Z0IiwiZXZlbnRfaWQiOiI5YTNjYjliMC04NTFmLTQ4ZWQtYTg1OC1kYzg3MmUyMmMwNjMiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTc0Mjg3MzkyMCwibmFtZSI6IlJhaHVsIiwiZXhwIjoxNzQyODc5NDA4LCJpYXQiOjE3NDI4NzU4MDgsImp0aSI6IjZkODk0N2QyLTBhNTItNGJjYi1iMzJiLTNlZDE1NTkzNmJiNSIsImVtYWlsIjoic29jaWFsLnJhaHVsYmFnY2hpMDRAZ21haWwuY29tIn0.hhCL0mJniDzC45d23JzBGozPM7e1xl5QTWKo3yUrItsH3DJQwqdWfGPjM6La7qSYT_6lAREez7n8NggFyQkrx3bnWi0gASWRtrLeSpKZwkwwmpnh95Hd6_LrT2y5ABoEda7IUHilrNY9mHzqrhzBdALqFX0jOtkQjz6fsbFxJXEYs3NwgGCLDdjPsxdQ17UTe0mNPMK-eGG68a9YQhwUPRVEZHRVagUOtkI288P5QA-xkmPIY9Vn59-ppzV1GxbPm0ExVAigjlZxBfMr1629g2LWGMUsaxGaSsfilsUpzAQx-75WcV0ppTjAyyHy9G4jN3-IIp48HDw6o4QhHozvgA',
        TokenType: 'Bearer'
        },
        ChallengeParameters: {}
        }
     */
    const { AuthenticationResult } = await cognito.send(cmd);
    return AuthenticationResult;
}

module.exports = {
    signup, verifySignup, resendSignupCode, login, requestResetPassword, resetPassword, changeEmail, verifyEmail, refreshAccessToken,

}
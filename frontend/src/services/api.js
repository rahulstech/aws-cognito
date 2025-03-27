import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import appStorage from '../app/Storage';

async function refreshAccessToken() {
    const url = new URL('/refreshtoken', import.meta.env.VITE_API_BASE_URL);
    const refreshToken = appStorage.getRefreshToken();

    try {
        const response = await fetch(url, { body: { refreshToken }, timeout: import.meta.env.VITE_API_TIMEOUT });
        const accessToken = response['access-token'];
        appStorage.putAccessToken(accessToken.token, accessToken.exp);
        return true;
    }
    catch(error) {
        if (error.status === 401) {

        }
    }
    return false;
}

const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: import.meta.env.VITE_API_BASE_URL,
    }),
    endpoints: (builder) => ({

        login: builder.mutation({
            query: ({ email, password }) => ({
                url: 'login',
                method: 'POST',
                body: { email, password }
            }),

            transformResponse(response) {
                const accessToken = response['access-token'];
                const refreshToken = response['refresh-token'];
                const accessTokenExpire = response['access-token-expire'];
                const user = response.user;

                appStorage.putAccessToken(accessToken, accessTokenExpire);
                appStorage.putRefreshToken(refreshToken);
                appStorage.putLoggedinUser(user);

                return true;
            },

            transformErrorResponse({ status, data }) {
                let errors = { statusCode: status };
                if (status === 404) {
                    errors.email = data.description ;
                }
                else if (status === 401) {
                    errors.password = 'incorrect password' ;
                }
                else if (status === 403) {
                    errors.description = 'not verified';
                }
                else if (data.details) {
                    errors = data.details.reduce( (prev, current) => {
                        prev[current.key] = current.explain;
                        return prev;
                    }, errors);
                }
                return errors;
            },
        }),

        signup: builder.mutation({
            query: ({ email, password, name }) => ({
                url: 'signup',
                method: 'POST',
                body: { email, password, name }
            }),

            transformResponse: (response) => true,

            transformErrorResponse({ status, data }) {
                let errors = { statusCode: status };
                if (status === 403) {
                    errors = { email: 'email already exists'};
                }
                else if (data.details) {
                    errors = data.details.reduce((prev, current) => {
                        prev[current.key] = current.explain;
                        return prev;
                    }, errors);
                }
                else {
                    errors.code = data.description;
                }
                return errors;
            },
        }),

        verifySignup: builder.mutation({
            query: ({ email, code }) => ({
                url: 'signup/verify',
                method: 'POST',
                body: { email, code }
            }),

            transformResponse: (response) => true,
            
            transformErrorResponse({ status, data }) {
                const { description, details } = data;
                let errors = { statusCode: status };
                if (description) {
                    errors.code = description;
                }
                else if (details) { 
                    errors = details.reduce((prev, current) => {
                        prev[current.key] = current.explain;
                        return prev;
                    }, errors);
                }
                return errors;
            },
        }),

        resendSignupCode: builder.mutation({
            query: (email) => ({
                url: '/signup/code',
                method: 'POST',
                body: { email },
            }),

            transformResponse: (response) => true,
        }),

        requestResetPasswordCode: builder.mutation({
            query: (email) => ({
                url: '/login/forgotpassword',
                method: 'POST',
                body: { email }
            }),

            transformResponse: (response) => true,

            transformErrorResponse({ status, data }) {
                console.log(' status ', status, ' data ', data);
                return {};
            },
            
        }),

        resetPassword: builder.mutation({
            query: ({ email, newPassword, code }) => ({
                url: '/login/resetpassword',
                method: 'PATCH',
                body: {email,newPassword,code},
            }),

            transformResponse: (response) => true,

            transformErrorResponse({ status, data }) {
                let errors = { statusCode: status };
                if (status === 404) {
                    errors.email = data.description;
                }
                else if (status === 400) {
                    if (data.details) {

                    }
                    else {

                    }
                }
            },
        }),

        updateEmail: builder.mutation({
            query: (newEmail) => ({
                url: '/profile/update/email',
                method: 'PATCH',
                body: { newEmail },
            }),

            transformResponse: (response) => true,

            transformErrorResponse({ status, data }) {
                let errors = { statusCode: status };
                if (status === 403) {
                    errors.email = data.description;
                }
                else if (data?.details) {
                    errors = data.details.reduce((prev,cur) => {
                        prev[cur.key] = cur.explain;
                        return prev;
                    }, errors);
                }
                return errors;
            }
        }),

        verifyEmail: builder.mutation({
            query: (code) => ({
                url: '/profile/verify/email',
                method: 'GET',
                params: { code },
            }),

            transformResponse: (response) => true,

            transformErrorResponse({ status, data }) {
                let errors = { statusCode: status };
                if (data?.details) {
                    errors = data.details.reduce((prev,cur) => {
                        prev[cur.key] = cur.explain;
                        return prev;
                    }, errors);
                }
                else {
                    errors.code = data.description;
                }
                return errors;
            }
        })
    })
})

export default api

export const { useLoginMutation, useSignupMutation, useVerifySignupMutation, useResendSignupCodeMutation,
    useRequestResetPasswordCodeMutation, useResetPasswordMutation, useUpdateEmailMutation, useVerifyEmailMutation, 
 } = api
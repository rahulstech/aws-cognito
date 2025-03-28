import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import appStorage from '../app/Storage'

import { updateEmail, setUser, removeUser, updateUser } from './storageSlice'

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: import.meta.env.VITE_API_BASE_URL,
    }),
    endpoints: (builder) => ({

        login: builder.mutation({
            async queryFn({ email, password }, api, extraOptions, baseQuery) {
                const response = await baseQuery({
                    url: 'login',
                    method: 'POST',
                    body: { email, password },
                }, api, extraOptions);

                if (response.error) {
                    const { status, data } = response.error;
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
                    return {  error: errors };
                }
                else {
                    const { data } = response;
                    const accessToken = data['access-token'];
                    const refreshToken = data['refresh-token'];
                    const accessTokenExpire = data['access-token-expire'];
                    const user = data.user;

                    appStorage.putAccessToken(accessToken, accessTokenExpire);
                    appStorage.putRefreshToken(refreshToken);
                    
                    api.dispatch(setUser({ user }));

                    return { data: true };
                }
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
                const { details } = data;
                let errors = { statusCode: status };
                if (details) {
                    errors = details.reduce((acc, cur) => {
                        acc[cur.key] = cur.explain;
                        return acc;
                    }, errors);
                }
                return errors;
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

        logout: builder.mutation({
            async queryFn(args, api, extraOptions, batchQuery) {
                api.dispatch(removeUser());
                return true;
            }
        }),
    })
})

export const { useLoginMutation, useSignupMutation, useVerifySignupMutation, useResendSignupCodeMutation,
    useRequestResetPasswordCodeMutation, useResetPasswordMutation, useLogoutMutation, } = api

async function refreshAccessToken() {
    const url = new URL('/refreshtoken', import.meta.env.VITE_API_BASE_URL);
    const refreshToken = appStorage.getRefreshToken();

    const response = await fetch(url, { 
        method: 'POST', 
        body: JSON.stringify({ refreshToken }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const status = response.status;
    const data = await response.json();
    if (status === 200) {
        const accessToken = data['access-token'];
        appStorage.putAccessToken(accessToken.token, accessToken.expire);
        return true;
    }
    else {
        return false;
    }
}

async function baseQuery(args, api, extraOptions) {

    // check access token is expired or not; if expired then refresh access token
    if (appStorage.isAccessTokenExpired()) {
        const success = await refreshAccessToken();
        if (!success) {
            api.dispatch(removeUser());
            return null;
        }
    }
    const result = await fetchBaseQuery({ 
        baseUrl: new URL('/profile', import.meta.env.VITE_API_BASE_URL).href,
        prepareHeaders: (headers) => {
            const accessToken = appStorage.getAccessToken();
            headers.append('Authorization', `Bearer ${accessToken}`);
            return headers;
        }
    })(args, api, extraOptions);
    return result;
}

export const apiProfile = createApi({
    reducerPath: 'api/profile',
    baseQuery,
    endpoints: (builder) => ({

        updateEmail: builder.mutation({
            async queryFn({ newEmail }, api, extraOptions, baseQuery) {
                const response = await baseQuery({
                    url: '/update/email',
                    method: 'PATCH',
                    body: { newEmail },
                }, api, extraOptions);

                if (response.error) {
                    const { status, data } = response.error;
                    let errors = { statusCode: status };
                    if (status === 403) {
                        errors.newEmail = data.description;
                    }
                    else if (data?.details) {
                        errors = data.details.reduce((prev,cur) => {
                            prev[cur.key] = cur.explain;
                            return prev;
                        }, errors);
                    }
                    return { error: errors};
                }
                else {
                    api.dispatch(updateEmail({ email: newEmail }));
                    return { data: true };
                }
            },
        }),

        resendEmailCode: builder.mutation({
            query: () => ({
                url: '/update/email/code',
                method: 'GET',
            }),

            transformResponse: (response) => true,
        }),

        verifyEmail: builder.mutation({
            query: (code) => ({
                url: '/verify/email',
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
        }),

        updateUser: builder.mutation({
            async queryFn(data, api, extraOptions, baseQuery) {
                const response = await baseQuery({
                    url: '/update',
                    method: 'PATCH',
                    body: data,
                }, api, extraOptions);

                if (response.error) {
                    const { status, data } = response.error;
                    return { error: { statusCode: status, description: data.description }};
                }
                else {
                    const user = response.data.user;
                    api.dispatch(updateUser(user));
                    return { data: true };
                }
            }
        }),
    }),
 })

 export const { useUpdateEmailMutation, useVerifyEmailMutation, useResendEmailCodeMutation, useUpdateUserMutation } = apiProfile;
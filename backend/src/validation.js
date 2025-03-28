const joi = require('joi');
const { pickOnly } = require('./utils');
const { AppError } = require('./errors');

const emailSchema = joi.string().email().required();

const codeSchema = joi.number().required().cast('string');

const passwordSchema = joi.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\]^_`{|}~]{8,}$/)
                        .required().messages({ 'string.patter.base': 'incorrect pattern' })


const signupSchemas = {
    body: joi.object({
        email: emailSchema,
        password: passwordSchema,
        name: joi.string().regex(/^[A-Za-z\s]+$/).required()
        .messages({
            "string.pattern.base": 'only letters and spaces are allowed',
        }),
    }).prefs({ allowUnknown: false })
}

const verifySignupSchemas = {
    body: joi.object({
        email: emailSchema,
        code: codeSchema,
    }).prefs({ allowUnknown: false })
}

const resendSignupCodeSchemas = {
    body: joi.object({
        email: emailSchema,
    }).prefs({ allowUnknown: false })
}

const loginSchema = {
    body: joi.object({
        email: emailSchema,
        password: joi.string().required(),
    }).prefs({ allowUnknown: false })
}

const forgetPasswordSchemas = {
    body: joi.object({
        email: emailSchema,
    }).prefs({ allowUnknown: false })
}

const resetPasswordSchemas = {
    body: joi.object({
        email: emailSchema,
        newPassword: passwordSchema,
        code: codeSchema,
    }).prefs({ allowUnknown: false })
}

const updateEmailSchema = {
    body: joi.object({
        newEmail: emailSchema,
    }).prefs({ allowUnknown: false })
}

const verifyEmailSchemas = {
    query: joi.object({
        code: codeSchema,
    }).prefs({ allowUnknown: false })
}

const refreshTokenSchemas = {
    body: joi.object({
        refreshToken: joi.string().required(),
    }).prefs({ allowUnknown: false })
}

const profileUpdateSchemas = {
    body: joi.object({
        name: joi.string(),
    }).prefs({ allowUnknown: false })
}

function getStatusCode(validateOptions, field, otherwise = 400) {
    if (!validateOptions) {
        return otherwise;
    }
    const code = validateOptions.code;
    const map = validateOptions.map;
    if (!map) {
        return code;
    }
    return map[field] || code;
}

function validate(schemas, options = null) {
    return async (req,res,next) => {
        const fields = Object.keys(schemas);
        const inputs = pickOnly(req, fields);
        for (let field of fields) {
            const schema = schemas[field];
            const values = inputs[field];
            try {
                const result = await schema.validateAsync(values,{ abortEarly: false });
                req[field] = result;
            }
            catch(error) {
                if (error.name === 'ValidationError') {
                    const details = error.details.map( e => ({ explain: e.message, key: e.context.key }))
                    const statusCode = getStatusCode(options, field);
                    throw new AppError(statusCode, { details });
                }
                throw error;
            }
        }
        next();
    }
}

module.exports = { 
    validate, signupSchemas, verifySignupSchemas, resendSignupCodeSchemas, loginSchema, forgetPasswordSchemas, resetPasswordSchemas, 
    updateEmailSchema, verifyEmailSchemas, refreshTokenSchemas, profileUpdateSchemas, 
}
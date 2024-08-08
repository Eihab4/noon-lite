import Joi from 'joi'

export const signUpValidation = Joi.object({
    name: Joi.string().required(), // User name must be a string and is required
    email: Joi.string().email().required(), // User email must be a valid email and is required
    password: Joi.string().pattern(new RegExp('^[A-Z][A-Za-z0-9]{8,40}$')).required(), // User password must be at least 8 characters long and is required
    passwordConfirm: Joi.string().valid(Joi.ref('password')).required(), // Confirm password must match the password field
})

export const signInValidation = Joi.object({
    email: Joi.string().email().required(), // User email must be a valid email and is required
    password: Joi.string().required() // User password must be a string and is required
})


export const changePasswordValidation = Joi.object({
    currentPassword: Joi.string().required(), // Current password must be a string and is required
    newPassword: Joi.string().pattern(new RegExp('^[A-Z][A-Za-z0-9]{8,40}$')).required(), // New password must be at least 8 characters long and is required
    passwordConfirm: Joi.string().valid(Joi.ref('newPassword')).required(),
})


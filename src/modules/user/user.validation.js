import Joi from "joi"

export const addUserValidation = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[A-Z][A-Za-z0-9]{8,40}$')).required(),
    role: Joi.string().valid('admin').required(),
})

export const getUserByIdValidation = Joi.object({
    id: Joi.string().required(),
})

export const updateUserValidation = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().min(3),
    email: Joi.string().email(),
    password: Joi.string().pattern(new RegExp('^[A-Z][A-Za-z0-9]{8,40}$')),
    role: Joi.string().valid('admin'),
})

export const deleteUserValidation = Joi.object({
    id: Joi.string().required(),
})

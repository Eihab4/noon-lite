import Joi from 'joi'


export const addReviewValidation = Joi.object({
    rate: Joi.number().min(1).max(5).required(),
    comment: Joi.string().min(5).required(),
    product: Joi.string().hex().length(24).required(),
    user: Joi.string().hex().length(24).required(),
})

export const updateReviewValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
    rate: Joi.number().min(1).max(5),
    comment: Joi.string().min(5),
    user: Joi.string().hex().length(24),
})

export const deleteReviewValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
})

export const getReviewByIdValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
})


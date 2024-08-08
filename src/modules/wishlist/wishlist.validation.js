import Joi from 'joi'

export const addToWishlistValidation = Joi.object({
    product: Joi.string().hex().length(24).required(),
})

export const removeFromWishlistValidation = Joi.object({
    product: Joi.string().hex().length(24).required(),
})

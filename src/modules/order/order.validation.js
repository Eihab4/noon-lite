import Joi from "joi"

export const updateOrderStatusValidation = Joi.object({
    status: Joi.string().valid('pending', 'processing', 'shipping', 'delivered', 'cancelled').required(),
    id: Joi.string().hex().length(24).required(),
})
export const shippingAddressValidation = Joi.object({
    city: Joi.string().required(),
    country: Joi.string().required(),
    street: Joi.string().required(),
    zipCode: Joi.string().required()
});
import Joi from "joi"

const cartItemSchema = Joi.object({
    product: Joi.string(), // Product ID, assumed to be a string
    quantity: Joi.number().integer().min(1), // Quantity must be an integer and at least 1
    price: Joi.number().positive() // Price must be a positive number
});

export const addCartValidation = Joi.object({
    cartItems: Joi.array().items(cartItemSchema).min(1).required(), // Array of cart items, each must be validated with cartItemSchema
    user:Joi.string().hex().length(24).required(),

})

export const updateCartValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
    cartItems: Joi.array().items(cartItemSchema).min(1).required(), // Array of cart items, each must be validated with cartItemSchema
})

export const removeFromCartValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
})

export const applyCouponValidation = Joi.object({
    code: Joi.string().required().min(3),
})

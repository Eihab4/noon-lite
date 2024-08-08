import Joi from "joi";


export const addBrandValidation = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().min(10).required(),
    price: Joi.number().positive().required(),
    quantity: Joi.number().positive().required(),
    image: Joi.object({
        filename: Joi.string().required(),
        mimetype: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().positive().max(5242880).required(),
        encoding: Joi.string().required(),
        originalname: Joi.string().required(),
        destination: Joi.string().required(),
    }),
    brand: Joi.string().required(),
    category: Joi.string().required(),
    subcategory: Joi.string().required(),
    
})

export const updateBrandValidation = Joi.object({
    name: Joi.string().min(3),
    description: Joi.string().min(10),
    price: Joi.number().positive(),
    quantity: Joi.number().positive(),
    image: Joi.object({
        filename: Joi.string(),
        mimetype: Joi.string(),
        path: Joi.string(),
        size: Joi.number().positive().max(5242880),
        encoding: Joi.string(),
        originalname: Joi.string(),
        destination: Joi.string(),
    }),
    brand: Joi.string(),
    category: Joi.string(),
    subcategory: Joi.string(),
    id:Joi.string().hex().length(24).required()
})

export const deleteBrandValidation = Joi.object({
    id: Joi.string().hex().length(24).required()
})

export const getBrandByIdValidation = Joi.object({
    id: Joi.string().hex().length(24).required()
})

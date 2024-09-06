import Joi from "joi";


export const addBrandValidation = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().min(10).required(),
    image: Joi.object({
    fieldname: Joi.string().required(),
    mimetype: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().positive().max(5242880).required(),
    encoding: Joi.string().required(),
    originalname: Joi.string().required(),
    destination: Joi.string().required(),
    filename: Joi.string()
    .pattern(/\.(png|jpg|jpeg|gif)$/)  // Allows .png, .jpg, .jpeg, and .gif extensions
    .required()
    }).required(),
    createdBy: Joi.string().hex().length(24).required()
})

export const updateBrandValidation = Joi.object({
    name: Joi.string().min(3),
    description: Joi.string().min(10),
    image: Joi.object({
    fieldname: Joi.string().required(),
    mimetype: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().positive().max(5242880).required(),
    encoding: Joi.string().required(),
    originalname: Joi.string().required(),
    destination: Joi.string().required(),
    filename: Joi.string()
    .pattern(/\.(png|jpg|jpeg|gif)$/)  // Allows .png, .jpg, .jpeg, and .gif extensions
    .required()
    }),
    id: Joi.string().hex().length(24).required(),
    createdBy: Joi.string().hex().length(24).required()
})

export const deleteBrandValidation = Joi.object({
    id: Joi.string().hex().length(24).required()
})

export const getBrandByIdValidation = Joi.object({
    id: Joi.string().hex().length(24).required()
})

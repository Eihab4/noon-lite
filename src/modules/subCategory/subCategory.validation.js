import Joi from 'joi'

export const addSubCategoryValidation = Joi.object({
    name: Joi.string().min(3).required(),
    image: Joi.object({
        filename: Joi.string().required(),
        mimetype: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().positive().max(5242880).required(),
        encoding: Joi.string().required(),
        originalname: Joi.string().required(),
        destination: Joi.string().required(),
    }),
    createdBy: Joi.string().hex().length(24).required(),
    category: Joi.string().hex().length(24).required()
    
})

export const updateSubCategoryValidation = Joi.object({
    name: Joi.string().min(3).required(),
    image: Joi.object({
        filename: Joi.string().required(),
        mimetype: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().positive().max(5242880).required(),
        encoding: Joi.string().required(),
        originalname: Joi.string().required(),
        destination: Joi.string().required(),
    }),
    id: Joi.string().hex().length(24).required(),
    createdBy: Joi.string().hex().length(24).required(),
    category: Joi.string().hex().length(24).required()
})


export const deleteSubCategoryValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
})

export const getSubCategoryByIdValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
})
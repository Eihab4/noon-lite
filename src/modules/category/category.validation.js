import Joi from "joi"



export const addCategoryValidation = Joi.object({
    name: Joi.string().min(3).required(),
    image: Joi.object({
        filename: Joi.string().required(),
        mimetype: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().positive().max(5242880).required(),
        encoding: Joi.string().required(),
        originalname: Joi.string().required(),
        destination: Joi.string().required(),
    }).required(),
    createdBy:Joi.string().hex().length(24).required()
});

export const updateCategoryValidation = Joi.object({
    name: Joi.string().min(3),
    image: Joi.object({
        filename: Joi.string(),
        mimetype: Joi.string(),
        path: Joi.string(),
        size: Joi.number(),
        encoding: Joi.string(),
        originalname: Joi.string(),
        destination: Joi.string(),
    }),
    id: Joi.string().hex().length(24).required(),
    createdBy:Joi.string().hex().length(24)
})

export const deleteCategoryValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
})

export const getCategoryByIdValidation = Joi.object({
    category: Joi.string().hex().length(24).required(),
})

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
    }).required()
});

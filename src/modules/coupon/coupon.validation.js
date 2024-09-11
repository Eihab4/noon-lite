import Joi from "joi";


export const addCouponValidation = Joi.object({
    code: Joi.string().min(3).required(),
    discount: Joi.number().min(1).max(100).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().min(Joi.ref('startDate')).required(),
    createdBy: Joi.string().hex().length(24).required(), // Reference to the user who created the coupon
});

export const updateCouponValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
    code: Joi.string().min(3),
    discount: Joi.number().min(1).max(100),
    startDate: Joi.date(),
    endDate: Joi.date().min(Joi.ref('startDate')),
    createdBy: Joi.string().hex().length(24).required(),
})

export const deleteCouponValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
})

export const getCouponByIdValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
})


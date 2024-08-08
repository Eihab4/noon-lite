import { Router } from 'express'
import { checkCoupon } from '../../middlewares/checkCoupon.middleware.js'
import { addCoupon, deleteCoupon, getAllCoupons, getCouponById, updateCoupon } from './coupon.controller.js'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js'
import { validate } from '../../middlewares/validate.middleware.js'
import { addCouponValidation, deleteCouponValidation, getCouponByIdValidation, updateCouponValidation } from './coupon.validation.js'

export const couponRouter= Router()

couponRouter.use(protectedRoutes,allowedTo('admin'))
couponRouter.post('/', validate(addCouponValidation),checkCoupon, addCoupon)
couponRouter.put('/:id', validate(updateCouponValidation),checkCoupon, updateCoupon)
couponRouter.get('/', getAllCoupons)
couponRouter.delete('/:id', validate(deleteCouponValidation),deleteCoupon)
couponRouter.get('/:id', validate(getCouponByIdValidation),getCouponById)
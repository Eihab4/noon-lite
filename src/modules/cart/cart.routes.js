import { Router } from 'express'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';
import { addToCart, applyCoupon, clearCart, getCartItems, removeFromCart, updateQuantity } from './cart.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { addCartValidation, applyCouponValidation, removeFromCartValidation, updateCartValidation } from './cart.validation.js';

export const cartRouter = Router();

cartRouter.use(protectedRoutes,allowedTo('user'))
cartRouter.post('/',  validate(addCartValidation),addToCart)
cartRouter.put('/:id',  validate(updateCartValidation),updateQuantity)
cartRouter.patch('/:id',  validate(removeFromCartValidation),removeFromCart)
cartRouter.get('/',  getCartItems)
cartRouter.delete('/',  clearCart)
cartRouter.post('/apply-coupon',  validate(applyCouponValidation),applyCoupon)

import { Router } from 'express'
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';
import { addToCart, applyCoupon, clearCart, getCartItems, removeFromCart, updateQuantity } from './cart.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { addCartValidation, applyCouponValidation, removeFromCartValidation, updateCartValidation } from './cart.validation.js';

export const cartRouter = Router();


cartRouter.post('/', protectedRoutes, allowedTo('user'), validate(addCartValidation),addToCart)
cartRouter.put('/:id', protectedRoutes, allowedTo('user'), validate(updateCartValidation),updateQuantity)
cartRouter.delete('/:id', protectedRoutes, allowedTo('user'), validate(removeFromCartValidation),removeFromCart)
cartRouter.get('/', protectedRoutes, allowedTo('user'), getCartItems)
cartRouter.delete('/', protectedRoutes, allowedTo('user'), clearCart)
cartRouter.post('/apply-coupon', protectedRoutes, allowedTo('user'), validate(applyCouponValidation),applyCoupon)

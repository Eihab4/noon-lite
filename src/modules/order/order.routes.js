import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { createCashOrder, createCheckoutSession, getAllOrders, getUserOrders, updateOrderStatus } from "./order.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { shippingAddressValidation, updateOrderStatusValidation } from "./order.validation.js";


export const orderRouter = Router();

orderRouter.post('/', protectedRoutes, allowedTo('user'), createCashOrder)
orderRouter.get('/user', protectedRoutes, allowedTo('user', 'admin'), getUserOrders)
orderRouter.get('/', protectedRoutes, allowedTo('user', 'admin'), getUserOrders)
orderRouter.get('/', protectedRoutes, allowedTo('user'), getAllOrders)
orderRouter.put('/:id', protectedRoutes, allowedTo('user', 'admin'), validate(updateOrderStatusValidation), updateOrderStatus)
orderRouter.post('/checkout', protectedRoutes, allowedTo('user'), validate(shippingAddressValidation), createCheckoutSession)




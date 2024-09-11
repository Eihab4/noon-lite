import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { createCashOrder, getAllOrders, getUserOrders, getUsersOrders, updateOrderStatus } from "./order.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { updateOrderStatusValidation } from "./order.validation.js";


export const orderRouter = Router();

orderRouter.post('/', protectedRoutes, allowedTo('user'), createCashOrder)
orderRouter.get('/userId', protectedRoutes, allowedTo('admin'), getUserOrders)
orderRouter.get('/admin', protectedRoutes, allowedTo('admin'), getUsersOrders)
orderRouter.get('/', protectedRoutes, allowedTo('user'), getAllOrders)
orderRouter.put('/:id', protectedRoutes, allowedTo('admin'), validate(updateOrderStatusValidation), updateOrderStatus)





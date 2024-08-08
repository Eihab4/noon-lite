import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { addToWishlist, getWishlist, removeFromWishlist } from "./wishlist.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { addToWishlistValidation, removeFromWishlistValidation } from "./wishlist.validation.js";

export const wishlistRouter = Router()


wishlistRouter.patch('/', protectedRoutes, allowedTo('user'), validate(addToWishlistValidation),addToWishlist)
wishlistRouter.delete('/', protectedRoutes, allowedTo('user', 'admin'), validate(removeFromWishlistValidation),removeFromWishlist)
wishlistRouter.get('/', protectedRoutes, allowedTo('user', 'admin'), getWishlist)


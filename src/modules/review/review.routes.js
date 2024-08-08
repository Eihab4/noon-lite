import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { addReview, deleteReview, getAllReviews, getReviewById, updateReview } from "./review.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { addReviewValidation, deleteReviewValidation, getReviewByIdValidation, updateReviewValidation } from "./review.validation.js";


export const reviewRouter = Router()

reviewRouter.post('/', protectedRoutes, allowedTo('user'), validate(addReviewValidation),addReview)
reviewRouter.get('/', getAllReviews)
reviewRouter.get('/:id', validate(getReviewByIdValidation),getReviewById)
reviewRouter.put('/:id', protectedRoutes, allowedTo('user'), validate(updateReviewValidation),updateReview)
reviewRouter.delete('/:id', protectedRoutes, allowedTo('user', 'admin'), validate(deleteReviewValidation),deleteReview)

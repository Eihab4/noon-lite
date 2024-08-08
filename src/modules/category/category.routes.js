import { Router } from "express";
import { addCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "./category.controller.js";
import { uploadSingleFile } from "../../fileUpload/fileUpload.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { addCategoryValidation, deleteCategoryValidation, getCategoryByIdValidation, updateCategoryValidation } from "./category.validation.js";


export const categoryRouter = Router()


categoryRouter.post('/', protectedRoutes,allowedTo('admin'),uploadSingleFile('image','categories'),validate(addCategoryValidation),addCategory)
categoryRouter.get('/', getAllCategories)
categoryRouter.get('/:category', validate(getCategoryByIdValidation),getCategoryById)
categoryRouter.put('/:id',protectedRoutes,allowedTo('admin') ,uploadSingleFile('image','categories'),validate(updateCategoryValidation),updateCategory)
categoryRouter.delete('/:id',protectedRoutes,allowedTo('admin'),validate(deleteCategoryValidation),deleteCategory)


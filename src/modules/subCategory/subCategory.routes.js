import { Router } from "express";
import { addSubCategory, deleteSubCategory, getAllSubCategories, getSubCategoryById, updateSubCategory } from "./subCategory.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { addSubCategoryValidation, deleteSubCategoryValidation, getSubCategoryByIdValidation, updateSubCategoryValidation } from "./subCategory.validation.js";



export const subCategoryRouter = Router({ mergeParams: true });


subCategoryRouter.post('/', protectedRoutes,allowedTo('admin'),validate(addSubCategoryValidation),addSubCategory)
subCategoryRouter.get('/',getAllSubCategories)
subCategoryRouter.get('/:id', validate(getSubCategoryByIdValidation),getSubCategoryById)
subCategoryRouter.put('/:id', protectedRoutes,allowedTo('admin'),validate(updateSubCategoryValidation),updateSubCategory)
subCategoryRouter.delete('/:id',protectedRoutes,allowedTo('admin'),validate(deleteSubCategoryValidation),deleteSubCategory)

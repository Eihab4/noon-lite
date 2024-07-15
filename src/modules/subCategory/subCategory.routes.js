import { Router } from "express";
import { addSubCategory, deleteSubCategory, getAllSubCategories, getSubCategoryById, updateSubCategory } from "./subCategory.controller.js";



export const subCategoryRouter = Router()


subCategoryRouter.post('/', addSubCategory)
subCategoryRouter.get('/', getAllSubCategories)
subCategoryRouter.get('/:id', getSubCategoryById)
subCategoryRouter.put('/:id', updateSubCategory)
subCategoryRouter.delete('/:id', deleteSubCategory)

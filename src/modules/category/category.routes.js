import { Router } from "express";
import { addCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "./category.controller.js";


export const categoryRouter = Router()


categoryRouter.post('/', addCategory)
categoryRouter.get('/', getAllCategories)
categoryRouter.get('/:id', getCategoryById)
categoryRouter.put('/:id', updateCategory)
categoryRouter.delete('/:id', deleteCategory)


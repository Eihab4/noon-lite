import { Router } from "express";
import { addCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "./category.controller.js";
import { uploadSingleFile } from "../../fileUpload/fileUpload.js";


export const categoryRouter = Router()


categoryRouter.post('/', uploadSingleFile('image','categories'),addCategory)
categoryRouter.get('/', getAllCategories)
categoryRouter.get('/:id', getCategoryById)
categoryRouter.put('/:id',  uploadSingleFile('image','categories'),updateCategory)
categoryRouter.delete('/:id', deleteCategory)


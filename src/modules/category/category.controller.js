import { Category } from "../../../DataBase/models/category.models.js"
import slugify from'slugify'
import { catchError } from "../../middlewares/catchError.middleware.js"
import { AppError } from "../../utils/AppError.utils.js"


export const addCategory = catchError(async (req, res, next) => {
    req.body.slug=slugify(req.body.name)
    const category = new Category(req.body)
    await category.save();
    res.status(201).json({message: "Added category",category})
})

export const getAllCategories = catchError(async (req, res, next) => {
    const categories = await Category.find()
    res.json(categories)
})

export const getCategoryById = catchError(async (req, res, next) => { 
    const category = await Category.findById(req.params.id)
    if (!category) return next(new AppError("Category not found",404))
    res.json(category)
})

export const updateCategory = catchError(async (req, res, next) => { 
    req.body.slug=slugify(req.body.name)
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if (!category) return next(new AppError("Category not found",404))
    res.json(category)
})

export const deleteCategory = catchError(async (req, res, next) => { 
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) return next(new AppError("Category not found",404))
    res.status(200).json({message: "Deleted category"})
})
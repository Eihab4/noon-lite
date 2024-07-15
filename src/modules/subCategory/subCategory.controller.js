import slugify from "slugify";
import { SubCategory } from "../../../DataBase/models/subCategory.model.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import { AppError } from "../../utils/AppError.utils.js";


export const addSubCategory = catchError(async (req, res, next) => {
    req.body.slug=slugify(req.body.name)
    const subCategory = new SubCategory(req.body);
    await subCategory.save();
    res.status(201).json({ message: "Added subcategory", subCategory });
})

export const getAllSubCategories = catchError(async (req, res, next) => {
    const subCategories = await SubCategory.find();
    res.status(200).json({message: "SubCategories retrieved successfully",subCategories})
});

export const getSubCategoryById = catchError(async (req, res, next) => { 
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) return next(new AppError("Subcategory not found",404));
    res.status(200).json({ message: "Subcategory retrieved successfully", subCategory });
})

export const updateSubCategory = catchError(async (req, res, next) => { 
    req.body.slug=slugify(req.body.name)
    const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!subCategory) return next(new AppError("Subcategory not found",404));
    res.status(200).json({ message: "Subcategory updated successfully", subCategory });
})

export const deleteSubCategory = catchError(async (req, res, next) => { 
    const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!subCategory) return next(new AppError("Subcategory not found",404));
    res.status(200).json({ message: "Subcategory deleted successfully" });
})
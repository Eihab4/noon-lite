import { Category } from "../../../DataBase/models/category.models.js"
import slugify from'slugify'
import { catchError } from "../../middlewares/catchError.middleware.js"
import { AppError } from "../../utils/AppError.utils.js"
import fs from 'fs';
import path from 'path';


export const addCategory = catchError(async (req, res, next) => {
    req.body.slug = slugify(req.body.name)
    if(req.file)req.body.image=req.file.filename
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
    req.body.slug = slugify(req.body.name);

    // Find the category by ID
    const category = await Category.findById(req.params.id);
    if (!category) {
        return next(new AppError("Category not found", 404));
    }

    // Delete old image if there's a new one
    if (req.file && req.file.filename) {
        const imageUrl = category.image;
        const parts = imageUrl.split('/');
        const fileName = parts[parts.length - 1]; // Extract filename from imageUrl

        // Construct full path to the old image
        const moduleURL = new URL(import.meta.url);
        const __dirname = path.dirname(moduleURL.pathname);
        const oldImagePath = path.join(__dirname, '../../../uploads/categories', fileName);

        // Check if the old image exists before attempting to delete
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        } else {
            next(new AppError('Old image not found',404))
        }
        req.body.image = req.file.filename; // Update req.body.image with the new filename
    }

    // Update the category
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCategory) {
        return next(new AppError("Category not found after update", 404));
    }

    // Respond with the updated category
    res.json({message:"category updated successfully",updatedCategory});
});


export const deleteCategory = catchError(async (req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return next(new AppError("Category not found", 404));

    // If the category has an image, delete it from the filesystem
    if (category.image) {
        const imageUrl = category.image;
        const parts = imageUrl.split('/');
        const fileName = parts[parts.length - 1]; // Extract filename from imageUrl

        // Construct full path to the image
        const moduleURL = new URL(import.meta.url);
        const __dirname = path.dirname(moduleURL.pathname);
        const imagePath = path.join(__dirname, '../../../uploads/categories', fileName);

        // Delete the image and handle any errors
        fs.unlink(imagePath, (err) => {
            if (err) {
                return next(new AppError('Error deleting image', 500));
            } else {
                console.log('Image deleted successfully!');
            }
        });
    }

    res.status(200).json({ message: "Deleted category" });
});
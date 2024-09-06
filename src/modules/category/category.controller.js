import { Category } from "../../../DataBase/models/category.models.js";
import slugify from 'slugify';
import { catchError } from "../../middlewares/catchError.middleware.js";
import { AppError } from "../../utils/AppError.utils.js";
import fs from 'fs';
import path from 'path';
import ApiFeature from "../../utils/ApiFeature.utils.js";

/**
 * Add a new category to the database.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const addCategory = catchError(async (req, res, next) => {
    // Generate slug from the category name
    req.body.slug = slugify(req.body.name);
    
    // Handle file upload if an image is provided
    if (req.file) req.body.image = req.file.filename;
    
    // Create and save the new category
    const category = new Category(req.body);
    await category.save();
    
    // Respond with the newly created category
    res.status(201).json({ message: "Added category", category });
});

/**
 * Retrieve all categories from the database with optional query parameters.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const getAllCategories = catchError(async (req, res, next) => {
    // Initialize Mongoose query to find all categories
    let mongooseQuery = await Category.find();
    
    // Apply ApiFeature to enhance query with filtering, sorting, pagination, and searching
    let apiFeature = new ApiFeature(mongooseQuery, req.query).search();
    
    // Execute the final query and retrieve categories
    const categories = await apiFeature.MongooseQuery;
    
    // Respond with the list of categories
    res.json({ message: "All categories retrieved successfully", categories });
});

/**
 * Retrieve a category by its ID.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const getCategoryById = catchError(async (req, res, next) => {
    // Find category by ID
    const category = await Category.findById(req.params.category);
    
    // Handle case where category is not found
    if (!category) return next(new AppError("Category not found", 404));
    
    // Respond with the found category
    res.json(category);
});

/**
 * Update an existing category by its ID.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const updateCategory = catchError(async (req, res, next) => {
    // Generate new slug from the updated category name
    req.body.slug = slugify(req.body.name);

    // Find the existing category by ID
    const category = await Category.findById(req.params.id);
    if (!category) return next(new AppError("Category not found", 404));
    
    // If a new image is provided, handle old image deletion
    if (req.file && req.file.filename) {
        const imageUrl = category.image;
        const parts = imageUrl.split('/');
        const fileName = parts[parts.length - 1]; // Extract filename from imageUrl

        // Construct path to the old image
        const moduleURL = new URL(import.meta.url);
        const __dirname = path.dirname(moduleURL.pathname);
        const oldImagePath = path.join(__dirname, '../../../uploads/categories', fileName);

        // Check if the old image exists before attempting to delete
        if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
        } else {
            return next(new AppError('Old image not found', 404));
        }
        
        // Update req.body.image with the new filename
        req.body.image = req.file.filename;
    }

    // Update the category with new data
    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCategory) return next(new AppError("Category not found after update", 404));

    // Respond with the updated category
    res.json({ message: "Category updated successfully", updatedCategory });
});

/**
 * Delete a category by its ID.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const deleteCategory = catchError(async (req, res, next) => {
    // Find the category by ID
    const category = await Category.findById(req.params.id);
    if (!category) return next(new AppError("Category not found", 404));  // If category doesn't exist

    // If the category has an image, delete the image file from the filesystem
    if (category.image) {
        const imageUrl = category.image;  // Get the image URL
        const parts = imageUrl.split('/');  // Split the URL to extract the filename
        const fileName = parts[parts.length - 1];  // Get the filename

        // Construct the full path to the image
        const moduleURL = new URL(import.meta.url);
        const __dirname = path.dirname(moduleURL.pathname);
        const imagePath = path.join(__dirname, '../../../uploads/categories', fileName);

        // Delete the image file and handle any errors
        fs.unlink(imagePath, (err) => {
            if (err) {
                return next(new AppError('Error deleting image', 500));  // Error handling during file deletion
            }
        });
    }

    // Now delete the category from the database
    await Category.findByIdAndDelete(req.params.id);

    // Respond with a success message
    res.status(200).json({ message: "Category deleted successfully" });
});

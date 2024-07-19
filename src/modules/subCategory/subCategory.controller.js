import slugify from "slugify";
import { SubCategory } from "../../../DataBase/models/subCategory.model.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import { AppError } from "../../utils/AppError.utils.js";
import { deleteOne, getOneById } from "../handlers/refactor.handler.js";
import ApiFeature from "../../utils/ApiFeature.utils.js";

/**
 * Add a new subcategory to the database.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const addSubCategory = catchError(async (req, res, next) => {
    // Generate a URL-friendly slug from the subcategory name
    req.body.slug = slugify(req.body.name);

    // Create a new SubCategory document and save it to the database
    const subCategory = new SubCategory(req.body);
    await subCategory.save();

    // Respond with the newly created subcategory
    res.status(201).json({ message: "Added subcategory", subCategory });
});

/**
 * Retrieve all subcategories from the database, with optional filtering, sorting, pagination, and search.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
export const getAllSubCategories = catchError(async (req, res) => {
    // Create a filter based on route parameters (e.g., category)
    const filter = {};
    if (req.params.category) {
        filter.category = req.params.category;
    }

    // Initialize Mongoose query with the created filter
    let mongooseQuery = SubCategory.find(filter);
    
    // Enhance the query with filtering, sorting, pagination, and search functionalities
    let apiFeature = new ApiFeature(mongooseQuery, req.query)
        .filter()    // Apply additional filtering if specified
        .sort()      // Apply sorting based on query parameters
        .paginate()  // Apply pagination based on query parameters
        .search();   // Apply search functionality based on query parameters

    // Execute the query and retrieve the list of subcategories
    const subCategories = await apiFeature.MongooseQuery;
    console.log('Retrieved Sub Categories:', subCategories); // Debugging line

    // Respond with the retrieved subcategories
    res.json({ message: "Subcategories retrieved successfully", subCategories });
});

/**
 * Retrieve a subcategory by its ID.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const getSubCategoryById = getOneById(SubCategory);

/**
 * Update an existing subcategory by its ID.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const updateSubCategory = catchError(async (req, res, next) => {
    // Generate a URL-friendly slug from the updated subcategory name
    req.body.slug = slugify(req.body.name);

    // Find and update the subcategory by ID with the new data
    const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Handle case where subcategory is not found
    if (!subCategory) return next(new AppError("Subcategory not found", 404));

    // Respond with the updated subcategory
    res.status(200).json({ message: "Subcategory updated successfully", subCategory });
});

/**
 * Delete a subcategory by its ID.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
export const deleteSubCategory = deleteOne(SubCategory);

// Importing the Joi validation library, which is used for data validation
import Joi from 'joi'

// Validation schema for adding a new subcategory
// - 'name' is required and must be a string with a minimum length of 3 characters
// - 'createdBy' must be a valid 24-character hex string (representing a MongoDB ObjectId)
// - 'category' must also be a valid 24-character hex string (representing a category ObjectId)
export const addSubCategoryValidation = Joi.object({
    name: Joi.string().min(3).required(),
    createdBy: Joi.string().hex().length(24).required(),
    category: Joi.string().hex().length(24).required()
})

// Validation schema for updating a subcategory
// - 'name' is required and must be a string with at least 3 characters
// - 'id' is required and must be a valid 24-character hex string (the subcategory's unique identifier)
// - 'createdBy' is required and must be a valid 24-character hex string (creator's ID)
// - 'category' is optional but, if provided, must be a valid 24-character hex string (category ID)
export const updateSubCategoryValidation = Joi.object({
    name: Joi.string().min(3).required(),
    id: Joi.string().hex().length(24).required(),
    createdBy: Joi.string().hex().length(24).required(),
    category: Joi.string().hex().length(24)
})

// Validation schema for deleting a subcategory
// - 'id' is required and must be a valid 24-character hex string (the unique identifier of the subcategory)
export const deleteSubCategoryValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
})

// Validation schema for fetching a subcategory by its ID
// - 'id' is required and must be a valid 24-character hex string (the subcategory's unique identifier)
export const getSubCategoryByIdValidation = Joi.object({
    id: Joi.string().hex().length(24).required(),
})

import Joi from 'joi'


export const addProductValidation = Joi.object({
    title: Joi.string().required(), // Product name must be a string and is required
    price: Joi.number().positive().required(), // Product price must be a positive number and is required
    quantity: Joi.number().positive().required(), // Product quantity must be a positive number and is required
    brand: Joi.string().hex().length(24).required(), // Brand ID must be a valid hex string and is required
    category: Joi.string().hex().length(24).required(), // Category ID must be a valid hex string and is required
    subCategory: Joi.string().hex().length(24).required(), // Subcategory ID must be a valid hex string and is required
    rateAverage: Joi.number().min(0).max(5).optional(), // Product rating average must be a number between 0 and 5
    rateCount: Joi.number().integer().optional(), // Product rating count must be an integer
    slug: Joi.string().optional(), // Slug is optional and should be a string
    createdBy: Joi.string().hex().length(24).required(),
    description: Joi.string().min(10).required(),
    imageCover:  Joi.object({
        fieldname: Joi.string().required(),
        mimetype: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().positive().max(5242880).required(),
        encoding: Joi.string().required(),
        originalname: Joi.string().required(),
        destination: Joi.string().required(),
        filename: Joi.string()
    .pattern(/\.(png|jpg|jpeg|gif)$/)  // Allows .png, .jpg, .jpeg, and .gif extensions
    .required()
    }).required(), // Main product image filename must be a string and is required
    images: Joi.array().items( Joi.object({
        fieldname: Joi.string().required(),
        mimetype: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().positive().max(5242880).required(),
        encoding: Joi.string().required(),
        originalname: Joi.string().required(),
        destination: Joi.string().required(),
        filename: Joi.string()
    .pattern(/\.(png|jpg|jpeg|gif)$/)  // Allows .png, .jpg, .jpeg, and .gif extensions
    .required()
    })).optional(), // Additional images filenames as an optional array of strings
});


export const updateProductValidation = Joi.object({
    title: Joi.string(), // Product name must be a string and is   price: Joi.number().positive(), // Product price must be a positive number and is   priceAfterDiscount: Joi.number().positive().optional(), // Discounted product price must be a positive number and is   quantity: Joi.number().positive(), // Product quantity must be a positive number and is   brand: Joi.string().hex().length(24), // Brand ID must be a valid hex string and is   category: Joi.string().hex().length(24), // Category ID must be a valid hex string and is   subCategory: Joi.string().hex().length(24), // Subcategory ID must be a valid hex string and is   rateAverage: Joi.number().min(0).max(5).optional(), // Product rating average must be a number between 0 and 5
    rateCount: Joi.number().integer().optional(), // Product rating count must be an integer
    slug: Joi.string().optional(), // Slug is optional and should be a string
    createdBy: Joi.string().hex().length(24).required(),
    description: Joi.string().min(10),
    imageCover:  Joi.object({
        fieldname: Joi.string().required(),
        mimetype: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().positive().max(5242880).required(),
        encoding: Joi.string().required(),
        originalname: Joi.string().required(),
        destination: Joi.string().required(),
        filename: Joi.string()
    .pattern(/\.(png|jpg|jpeg|gif)$/)  // Allows .png, .jpg, .jpeg, and .gif extensions
    .required()
    }), // Main product image filename must be a string and is required
    images: Joi.array().items( Joi.object({
        fieldname: Joi.string().required(),
        mimetype: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().positive().max(5242880).required(),
        encoding: Joi.string().required(),
        originalname: Joi.string().required(),
        destination: Joi.string().required(),
        filename: Joi.string()
    .pattern(/\.(png|jpg|jpeg|gif)$/)  // Allows .png, .jpg, .jpeg, and .gif extensions
    .required()
    })).optional(),
    // Additional images filenames as an optional array of strings
    id: Joi.string().hex().length(24).required()
});
export const deleteProductValidation = Joi.object({
    id: Joi.string().hex().length(24).required(), // Product ID must be a valid hex string and is required
})

export const getProductByIdValidation = Joi.object({
    id: Joi.string().hex().length(24).required(), // Product ID must be a valid hex string and is required
})

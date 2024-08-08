import Joi from 'joi'


export const addProductValidation = Joi.object({
    name: Joi.string().required(), // Product name must be a string and is required
    imageCover: Joi.object({
        filename: Joi.string().required(),
        mimetype: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().positive().max(5242880).required(),
        encoding: Joi.string().required(),
        originalname: Joi.string().required(),
        destination: Joi.string().required(),
    }), // Main product image filename must be a string and is required
    images: Joi.array().items(Joi.object({
        filename: Joi.string().required(),
        mimetype: Joi.string().required(),
        path: Joi.string().required(),
        size: Joi.number().positive().max(5242880).required(),
        encoding: Joi.string().required(),
        originalname: Joi.string().required(),
        destination: Joi.string().required(),
    })).optional(), // Additional images filenames as an optional array of strings
    slug: Joi.string().optional(), // Slug is optional and should be a string
    // Add other product fields here if needed
});
export const updateProductValidation = Joi.object({
    id: Joi.string().hex().length(24).required(), // Product ID must be a valid hex string and is required

    name: Joi.string()
        .min(3) // Minimum length of 3 characters for the product name
        .optional(), // Product name is optional for updates

    imageCover: Joi.object({
        filename: Joi.string().optional(), // Filename must be a string, optional
        mimetype: Joi.string().optional(), // MIME type of the file, optional
        path: Joi.string().optional(), // Path where the file is stored, optional
        size: Joi.number().positive().max(5242880).optional(), // File size must be a positive number and should not exceed 5MB (5242880 bytes), optional
        encoding: Joi.string().optional(), // Encoding of the file, optional
        originalname: Joi.string().optional(), // Original name of the file, optional
        destination: Joi.string().optional(), // Destination directory of the file, optional
    }).optional(), // `imageCover` is optional

    images: Joi.array().items(Joi.object({
        filename: Joi.string().optional(), // Filename must be a string, optional
        mimetype: Joi.string().optional(), // MIME type of the file, optional
        path: Joi.string().optional(), // Path where the file is stored, optional
        size: Joi.number().positive().max(5242880).optional(), // File size must be a positive number and should not exceed 5MB (5242880 bytes), optional
        encoding: Joi.string().optional(), // Encoding of the file, optional
        originalname: Joi.string().optional(), // Original name of the file, optional
        destination: Joi.string().optional(), // Destination directory of the file, optional
    })).optional(), // `images` is optional

    // You can add other fields as needed here
});

export const deleteProductValidation = Joi.object({
    id: Joi.string().hex().length(24).required(), // Product ID must be a valid hex string and is required
})

export const getProductByIdValidation = Joi.object({
    id: Joi.string().hex().length(24).required(), // Product ID must be a valid hex string and is required
})

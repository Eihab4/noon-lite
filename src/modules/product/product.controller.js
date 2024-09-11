import slugify from "slugify";
import { Product } from "../../../DataBase/models/product.model.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import { AppError } from "../../utils/AppError.utils.js";
import ApiFeature from "../../utils/ApiFeature.utils.js";
import path from 'path';
import fs from 'fs';

/**
 * Add a new product to the database.
 * Handles image uploads (cover image and array of images) via multer and assigns filenames.
 * @return product
 */

export const addProduct = catchError(async (req, res, next) => {
    // Ensure that imageCover and images are uploaded via multer.
    if (!req.files || !req.files.imageCover || req.files.images.length === 0) {
        return next(new AppError('Please upload at least one image for imageCover and images', 400));
    }

    // Assign the uploaded cover image filename to imageCover field.
    req.body.imageCover = req.files.imageCover[0].filename;

    // Assign the array of uploaded image filenames to the images field.
    req.body.images = req.files.images.map((file) => file.filename);

    // Generate a slug based on the product's title.
    req.body.slug = slugify(req.body.title);

    // Create a new Product instance and save it to the database.
    const product = new Product(req.body);
    await product.save();

    // Send a success response with the newly created product.
    res.status(201).json({ message: 'Added product', product });
});

/**
 * Retrieve all products from the database, applying filters, sorting, pagination, and search as needed.
 */
export const getAllProducts = catchError(async (req, res) => {
    // Initialize the query to retrieve all products.
    let mongooseQuery = Product.find();
    
    // Apply filtering, sorting, pagination, and search using ApiFeature.
    let apiFeature = new ApiFeature(mongooseQuery, req.query)
        .filter()
        .sort()
        .paginate()
        .search();

    // Execute the query to retrieve products.
    const products = await apiFeature.MongooseQuery;

    // Send a success response with the retrieved products.
    res.json({ message: "All products retrieved successfully", products });
});

/**
 * Retrieve a single product by its ID.
 */
export const getProductById = catchError(async (req, res, next) => { 
    const product = await Product.findById(req.params.id);
    if (!product) return next(new AppError("Product not found", 404));

    // Send a success response with the retrieved product.
    res.json(product);
});

/**
 * Update an existing product by its ID, including updating images (cover and array of images).
 */
export const updateProduct = catchError(async (req, res, next) => {
    // Generate a new slug if the product name is updated.
    if (req.body.name) {
        req.body.slug = slugify(req.body.name);
    }

    // Find the existing product in the database by ID.
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    // If a new image cover is uploaded, remove the old image cover from the filesystem.
    if (req.files.imageCover && req.files.imageCover.length > 0) {
        const imageCoverUrl = product.imageCover;
        if (imageCoverUrl) {
            const parts = imageCoverUrl.split('/');
            const fileName = parts[parts.length - 1];

            // Construct full path to the old image cover.
            const moduleURL = new URL(import.meta.url);
            const __dirname = path.dirname(moduleURL.pathname);
            const oldImageCoverPath = path.join(__dirname, '../../../uploads/products', fileName);

            // Delete the old image cover from the filesystem.
            if (fs.existsSync(oldImageCoverPath)) {
                fs.unlinkSync(oldImageCoverPath);
            }
        }

        // Assign the new image cover filename.
        req.body.imageCover = req.files.imageCover[0].filename;
    }

    // If new images are uploaded, remove old images that are no longer used.
    if (req.files.images && req.files.images.length > 0) {
        const imagesUrls = product.images;
        const newImages = req.files.images.map((file) => file.filename);

        // Identify old images to be deleted.
        const oldImagesToDelete = imagesUrls.filter((url) => !newImages.includes(url));

        // Delete each old image from the filesystem.
        oldImagesToDelete.forEach((url) => {
            const parts = url.split('/');
            const fileName = parts[parts.length - 1];

            // Construct full path to the old image.
            const moduleURL = new URL(import.meta.url);
            const __dirname = path.dirname(moduleURL.pathname);
            const oldImagePath = path.join(__dirname, '../../../uploads/products', fileName);

            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        });

        // Assign the new image filenames.
        req.body.images = newImages;
    }

    // Update the product in the database.
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Send a success response with the updated product.
    res.json({ message: 'Product updated successfully', product: updatedProduct });
});

/**
 * Delete a product by its ID, including removing associated images (cover and array of images) from the filesystem.
 */
export const deleteProduct = catchError(async (req, res, next) => {
    // Find the product in the database by ID.
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    // Helper function to delete files from the filesystem.
    const deleteFile = (filePath) => {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    };

    // Delete the image cover from the filesystem if it exists.
    if (product.imageCover) {
        const imageCoverUrl = product.imageCover;
        const parts = imageCoverUrl.split('/');
        const fileName = parts[parts.length - 1];

        // Construct full path to the image cover.
        const moduleURL = new URL(import.meta.url);
        const __dirname = path.dirname(moduleURL.pathname);
        const imagePath = path.join(__dirname, '../../../uploads/products', fileName);

        deleteFile(imagePath);
    }

    // Delete each image in the images array from the filesystem.
    if (product.images && product.images.length > 0) {
        product.images.forEach((imageUrl) => {
            const parts = imageUrl.split('/');
            const fileName = parts[parts.length - 1];

            // Construct full path to the image.
            const moduleURL = new URL(import.meta.url);
            const __dirname = path.dirname(moduleURL.pathname);
            const imagePath = path.join(__dirname, '../../../uploads/products', fileName);

            deleteFile(imagePath);
        });
    }

    // Delete the product from the database.
    await Product.findByIdAndDelete(req.params.id);

    // Send a success response.
    res.status(200).json({ message: 'Deleted product and associated images' });
});

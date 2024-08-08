import slugify from "slugify";
import { Product } from "../../../DataBase/models/product.model.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import { AppError } from "../../utils/AppError.utils.js";
import ApiFeature from "../../utils/ApiFeature.utils.js";

export const addProduct = catchError(async (req, res, next) => {
    // Check if req.files and req.files.imageCover are properly handled by multer
    if (!req.files || !req.files.imageCover || req.files.images.length === 0) {
        return next(new AppError('Please upload at least one image for imageCover and images', 400));
    }

    // Assign filename to imageCover
    req.body.imageCover = req.files.imageCover[0].filename;

    // Assign array of filenames to images
    req.body.images = req.files.images.map((file) => file.filename);

    // Generate slug from product name
    req.body.slug = slugify(req.body.name);

    // Create a new Product instance using req.body
    const product = new Product(req.body);

    // Save the product to the database
    await product.save();

    // Respond with a success message and the created product
    res.status(201).json({ message: 'Added product', product });
});

export const getAllProducts = catchError(async (req, res) => {
    // Initialize Mongoose query to find all products
    let mongooseQuery = Product.find();
    
    // Initialize ApiFeature with mongooseQuery and the search query from the request
    let apiFeature = new ApiFeature(mongooseQuery, req.query)
        .filter()    // Apply filtering if needed
        .sort()      // Apply sorting if needed
        .paginate()  // Apply pagination if needed
        .search();   // Apply search functionality if needed

    // Execute the final query and retrieve products
    const products = await apiFeature.MongooseQuery;
    console.log('Retrieved Products:', products); // Debugging line

    // Send the response with products
    res.json({ message: "All products retrieved successfully", products });
});

export const getProductById = catchError(async (req, res, next) => { 
    const product = await Product.findById(req.params.id)
    if (!product) return next(new AppError("Product not found",404))
    res.json(product)
})

export const updateProduct = catchError(async (req, res, next) => {
    // Generate new slug if product name is updated
    if (req.body.name) {
        req.body.slug = slugify(req.body.name);
    }

    // Find the product by ID
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    // Update image cover if a new file is uploaded
    if (req.files.imageCover && req.files.imageCover.length > 0) {
        const imageCoverUrl = product.imageCover;
        if (imageCoverUrl) {
            const parts = imageCoverUrl.split('/');
            const fileName = parts[parts.length - 1]; // Extract filename from imageCoverUrl

            // Construct full path to the old image cover
            const moduleURL = new URL(import.meta.url);
            const __dirname = path.dirname(moduleURL.pathname);
            const oldImageCoverPath = path.join(__dirname, '../../../uploads/products', fileName);

            // Delete the old image cover if it exists
            if (fs.existsSync(oldImageCoverPath)) {
                fs.unlinkSync(oldImageCoverPath);
                console.log('Old image cover deleted successfully!');
            } else {
                console.log('Old image cover not found:', oldImageCoverPath);
            }
        }

        req.body.imageCover = req.files.imageCover[0].filename;
    }

    // Update images array if new files are uploaded or existing ones are replaced
    if (req.files.images && req.files.images.length > 0) {
        // Filter out old images that are no longer used
        const imagesUrls = product.images;
        const newImages = req.files.images.map((file) => file.filename);

        const oldImagesToDelete = imagesUrls.filter((url) => !newImages.includes(url));

        // Delete old images that are no longer used
        oldImagesToDelete.forEach((url) => {
            const parts = url.split('/');
            const fileName = parts[parts.length - 1]; // Extract filename from url

            // Construct full path to the old image
            const moduleURL = new URL(import.meta.url);
            const __dirname = path.dirname(moduleURL.pathname);
            const oldImagePath = path.join(__dirname, '../../../uploads/products', fileName);

            // Delete the old image if it exists
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
                console.log(`Old image ${fileName} deleted successfully!`);
            } else {
                console.log(`Old image ${fileName} not found:`, oldImagePath);
            }
        });

        // Update req.body.images with the filenames of all uploaded images
        req.body.images = newImages;
    }

    // Update the product in the database
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Respond with the updated product
    res.json({ message: 'Product updated successfully', product: updatedProduct });
});

export const deleteProduct = catchError(async (req, res, next) => {
    // Find the product by ID and delete it
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    // Delete image cover if it exists
    if (product.imageCover) {
        const imageCoverUrl = product.imageCover;
        const parts = imageCoverUrl.split('/');
        const fileName = parts[parts.length - 1]; // Extract filename from imageCoverUrl

        // Construct full path to the image cover
        const moduleURL = new URL(import.meta.url);
        const __dirname = path.dirname(moduleURL.pathname);
        const imagePath = path.join(__dirname, '../../../uploads/products', fileName);

        // Delete the image cover file
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`Deleted image cover ${fileName} successfully!`);
        } else {
            console.log(`Image cover ${fileName} not found:`, imagePath);
        }
    }

    // Delete images array if they exist
    if (product.images && product.images.length > 0) {
        product.images.forEach((imageUrl) => {
            const parts = imageUrl.split('/');
            const fileName = parts[parts.length - 1]; // Extract filename from imageUrl

            // Construct full path to each image
            const moduleURL = new URL(import.meta.url);
            const __dirname = path.dirname(moduleURL.pathname);
            const imagePath = path.join(__dirname, '../../../uploads/products', fileName);

            // Delete the image file
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
                console.log(`Deleted image ${fileName} successfully!`);
            } else {
                console.log(`Image ${fileName} not found:`, imagePath);
            }
        });
    }

    // Respond with success message
    res.status(200).json({ message: 'Deleted product and associated images' });
});
import slugify from "slugify";  // Importing slugify for generating URL-friendly slugs from brand names
import { Brand } from "../../../DataBase/models/brand.model.js";  // Importing the Brand model from the database
import { catchError } from "../../middlewares/catchError.middleware.js";  // Importing the catchError middleware to handle async errors
import { AppError } from "../../utils/AppError.utils.js";  // Importing AppError to handle application-specific errors
import path from 'path'
import fs from 'fs'
// Handler to add a new brand
export const addBrand = catchError(async (req, res, next) => {
    // If a file is uploaded, update the request body with the filename of the logo
    if (req.file && req.file.filename) {
        req.body.logo = req.file.filename; // Update req.body.logo with the new filename
    }
    
    // Create a slug for the brand name to be URL-friendly
    req.body.slug = slugify(req.body.name);
    
    // Create a new brand using the data from the request body
    const brand = new Brand(req.body);
    await brand.save();  // Save the new brand to the database
    
    // Respond with a success message and the created brand object
    res.status(201).json({ message: "Added brand", brand });
});

// Handler to retrieve all brands
export const getAllBrands = catchError(async (req, res, next) => {
    const brands = await Brand.find();  // Fetch all brands from the database
    res.status(200).json({ message: "Brands retrieved successfully", brands });  // Respond with the brands
});

// Handler to retrieve a single brand by its ID
export const getBrandById = catchError(async (req, res, next) => { 
    const brand = await Brand.findById(req.params.id);  // Find the brand by its ID
    if (!brand) return next(new AppError("Brand not found", 404));  // Return an error if the brand is not found
    res.status(200).json({ message: "Brand retrieved successfully", brand });  // Respond with the brand data
});

// Handler to update a brand
export const updateBrand = catchError(async (req, res, next) => {
    // If the name is updated, generate a new slug
    if(req.body.name) req.body.slug = slugify(req.body.name);

    // Find the brand by its ID
    const brand = await Brand.findById(req.params.id);
    if (!brand) return next(new AppError("brand not found", 404));  // Return an error if the brand is not found

    // If a new logo is uploaded, delete the old logo file from the server
    if (req.file && req.file.filename) {
        const logoUrl = brand.logo;  // Get the current logo URL
        const parts = logoUrl.split('/');  // Split the URL to extract the filename
        const fileName = parts[parts.length - 1];  // Get the last part, which is the filename

        // Get the directory path and construct the full path to the old logo
        const moduleURL = new URL(import.meta.url);
        const __dirname = path.dirname(moduleURL.pathname);
        const oldLogoPath = path.join(__dirname, '../../../uploads/brands', fileName);

        // Check if the old logo exists and delete it if it does
        if (fs.existsSync(oldLogoPath)) {
            fs.unlinkSync(oldLogoPath);
        } else {
            next(new AppError('Old logo not found', 404));  // Error if the logo is not found
        }
        
        req.body.logo = req.file.filename;  // Update req.body.logo with the new filename
    }

    // Update the brand with the new data
    const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBrand) return next(new AppError("brand not found after update", 404));  // Error if the brand is not found after update

    // Respond with the updated brand data
    res.json(updatedBrand);
});

// Handler to delete a brand
export const deleteBrand = catchError(async (req, res, next) => {
    // Find the brand first
    const brand = await Brand.findById(req.params.id);
    if (!brand) return next(new AppError("Brand not found", 404));  // If brand doesn't exist

    // If the brand has a logo, delete the logo file from the server
    if (brand.logo) {
        const logoUrl = brand.logo;  // Get the logo URL
        const parts = logoUrl.split('/');  // Split the URL to extract the filename
        const fileName = parts[parts.length - 1];  // Get the filename

        // Construct the full path to the logo
        const moduleURL = new URL(import.meta.url);
        const __dirname = path.dirname(moduleURL.pathname);
        const logoPath = path.join(__dirname, '../../../uploads/brands', fileName);

        // Delete the logo file and handle any errors
        fs.unlink(logoPath, (err) => {
            if (err) {
                return next(new AppError('Error deleting logo', 500));  // Error handling during file deletion
            }
        });
    }

    // Now delete the brand from the database
    await Brand.findByIdAndDelete(req.params.id);

    // Respond with a success message
    res.status(200).json({ message: "Brand deleted successfully" });
});


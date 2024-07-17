import { Brand } from "../../../DataBase/models/brand.model.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import { AppError } from "../../utils/AppError.utils.js";

export const addBrand = catchError(async (req, res, next) => {
    if (req.file && req.file.filename) {
        req.body.logo = req.file.filename; // Update req.body.logo with the new filename
    }
    req.body.slug=slugify(req.body.name)
    const brand = new Brand(req.body);
    await brand.save();
    res.status(201).json({ message: "Added brand", brand });
})

export const getAllBrands = catchError(async (req, res, next) => {
    const brands = await Brand.find();
    res.status(200).json({message: "Brands retrieved successfully", brands });
});

export const getBrandById = catchError(async (req, res, next) => { 
    const brand = await Brand.findById(req.params.id);
    if (!brand) return next(new AppError("Brand not found",404));
    res.status(200).json({ message: "Brand retrieved successfully", brand });
})

export const updateBrand = catchError(async (req, res, next) => {
    if(req.body.name)req.body.slug = slugify(req.body.name);

    // Find the brand by ID
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
        return next(new AppError("brand not found", 404));
    }

    // Delete old logo if there's a new one
    if (req.file && req.file.filename) {
        const logoUrl = brand.logo;
        const parts = logoUrl.split('/');
        const fileName = parts[parts.length - 1]; // Extract filename from logoUrl

        // Construct full path to the old logo
        const moduleURL = new URL(import.meta.url);
        const __dirname = path.dirname(moduleURL.pathname);
        const oldLogoPath = path.join(__dirname, '../../../uploads/brands', fileName);

        // Check if the old logo exists before attempting to delete
        if (fs.existsSync(oldLogoPath)) {
            fs.unlinkSync(oldLogoPath);
        } else {
            next(new AppError('Old logo not found',404))
        }
        req.body.logo = req.file.filename; // Update req.body.logo with the new filename
    }

    // Update the brand
    const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBrand) {
        return next(new AppError("brand not found after update", 404));
    }

    // Respond with the updated brand
    res.json(updatedBrand);
});

export const deleteBrand = catchError(async (req, res, next) => {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) return next(new AppError("Brand not found", 404));

    // If the brand has a logo, delete it from the filesystem
    if (brand.logo) {
        const logoUrl = brand.logo;
        const parts = logoUrl.split('/');
        const fileName = parts[parts.length - 1]; // Extract filename from logoUrl

        // Construct full path to the logo
        const moduleURL = new URL(import.meta.url);
        const __dirname = path.dirname(moduleURL.pathname);
        const logoPath = path.join(__dirname, '../../../uploads/brands', fileName);

        // Delete the logo and handle any errors
        fs.unlink(logoPath, (err) => {
            if (err) {
                return next(new AppError('Error deleting logo', 500));
            } else {
                console.log('Logo deleted successfully!');
            }
        });
    }

    res.status(200).json({ message: "Brand deleted successfully" });
});
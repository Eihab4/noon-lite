import { Brand } from "../../../DataBase/models/brand.model.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import { AppError } from "../../utils/AppError.utils.js";

export const addBrand = catchError(async (req, res, next) => {
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
    req.body.slug=slugify(req.body.name)
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!brand) return next(new AppError("Brand not found",404));
    res.status(200).json({ message: "Brand updated successfully", brand });
})

export const deleteBrand = catchError(async (req, res, next) => { 
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) return next(new AppError("Brand not found",404));
    res.status(200).json({ message: "Brand deleted successfully" });
})
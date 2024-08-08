import { Router } from "express";
import { addBrand, deleteBrand, getAllBrands, getBrandById, updateBrand } from "./brand.controller.js";
import { uploadSingleFile } from "../../fileUpload/fileUpload.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { addBrandValidation, deleteBrandValidation, getBrandByIdValidation, updateBrandValidation } from "./brand.validation.js";

export const brandRouter = Router()

brandRouter.post('/', protectedRoutes,allowedTo('admin'),uploadSingleFile('logo','brands'),validate(addBrandValidation),addBrand)
brandRouter.get('/', getAllBrands)
brandRouter.get('/:id', validate(getBrandByIdValidation),getBrandById)
brandRouter.put('/:id', validate(deleteBrandValidation),protectedRoutes,allowedTo('admin'),uploadSingleFile('logo','brands'),validate(updateBrandValidation),updateBrand)
brandRouter.delete('/:id', protectedRoutes,allowedTo('admin'),deleteBrand)

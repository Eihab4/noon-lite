import { Router } from "express";
import { addBrand, deleteBrand, getAllBrands, getBrandById, updateBrand } from "./brand.controller.js";
import { uploadSingleFile } from "../../fileUpload/fileUpload.js";

export const brandRouter = Router()

brandRouter.post('/', uploadSingleFile('logo','brands'),addBrand)
brandRouter.get('/', getAllBrands)
brandRouter.get('/:id', getBrandById)
brandRouter.put('/:id', uploadSingleFile('logo','brands'),updateBrand)
brandRouter.delete('/:id', deleteBrand)

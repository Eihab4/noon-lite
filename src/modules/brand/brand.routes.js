import { Router } from "express";
import { addBrand, deleteBrand, getAllBrands, getBrandById, updateBrand } from "./brand.controller.js";

export const brandRouter = Router()

brandRouter.post('/', addBrand)
brandRouter.get('/', getAllBrands)
brandRouter.get('/:id', getBrandById)
brandRouter.put('/:id', updateBrand)
brandRouter.delete('/:id', deleteBrand)

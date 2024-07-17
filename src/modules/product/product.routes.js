import { Router } from "express";
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "./product.controller.js";
import { uploadMultipleFiles } from "../../fileUpload/fileUpload.js";


export const productRouter=Router()


productRouter.post('/', uploadMultipleFiles([{name:'imageCover',maxCount:1},{name:'images',maxCount:10}]),addProduct)
productRouter.get('/', getAllProducts)
productRouter.get('/:id', getProductById)
productRouter.put('/:id',  uploadMultipleFiles([{name:'imageCover',maxCount:1},{name:'images',maxCount:10}]),updateProduct)
productRouter.delete('/:id', deleteProduct)

import { Router } from "express";
import { addProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "./product.controller.js";


export const productRouter=Router()


productRouter.post('/', addProduct)
productRouter.get('/', getAllProducts)
productRouter.get('/:id', getProductById)
productRouter.put('/:id', updateProduct)
productRouter.delete('/:id', deleteProduct)

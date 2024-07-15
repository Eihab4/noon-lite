import slugify from "slugify";
import { Product } from "../../../DataBase/models/product.model.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import { AppError } from "../../utils/AppError.utils.js";

export const addProduct = catchError(async (req, res, next) => {
    req.body.slug=slugify(req.body.name)
    const product = new Product(req.body)
    await product.save()
    res.status(201).json({ message: "Added product", product })
})

export const getAllProducts = catchError(async (req, res, next) => {
    const products = await Product.find()
    res.json(products)
})

export const getProductById = catchError(async (req, res, next) => { 
    const product = await Product.findById(req.params.id)
    if (!product) return next(new AppError("Product not found",404))
    res.json(product)
})

export const updateProduct = catchError(async (req, res, next) => { 
    if (req.body.name) {
        req.body.slug=slugify(req.body.name)
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true})
    if (!product) return next(new AppError("Product not found",404))
    res.json(product)
})

export const deleteProduct = catchError(async (req, res, next) => { 
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return next(new AppError("Product not found",404))
    res.status(200).json({message: "Deleted product"})
})
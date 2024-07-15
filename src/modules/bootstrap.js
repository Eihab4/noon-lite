import { categoryRouter } from "./category/category.routes.js"
import { productRouter } from "./product/product.routes.js"
import { subCategoryRouter } from "./subCategory/subCategory.routes.js"

export const bootstrap = app => {
    app.use('/api/categories', categoryRouter)
    app.use('/api/subcategories', subCategoryRouter) 
    app.use('/api/products', productRouter)
}
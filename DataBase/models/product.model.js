import { Schema, model } from 'mongoose'


const productSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength:[3,'two short for product name']
    },
    slug: {
        type: String,
        lowercase: true,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minLength:[10,'description too short']
    },
    price: {
        type: Number,
        required: true
    },
    priceAfterDiscount: {
        type: Number,
        required: true,
        min:0
    },
    quantity: {
        type: Number,
        required: true,
        min:0
    },
    sold: {
    type:Number 
    },
    images: [String],
    imageCover: String,
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory'
    },
    rateAverage: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    rateCount: Number,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

export const Product = model('Product', productSchema)
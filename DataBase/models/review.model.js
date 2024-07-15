import { Schema, model } from 'mongoose'

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true,
        trim: true,
        minLength:[3,'two short for review comment']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    rate: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
    
})

export const Review = model('Review', reviewSchema)
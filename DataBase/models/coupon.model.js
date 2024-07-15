import { Schema, model } from 'mongoose'


const couponSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength:[3,'two short for coupon code']
    },
    discount: {
        type: Number,
        required: true,
        min: 1,
        max: 100
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
})

export const Coupon = model('Coupon', couponSchema)

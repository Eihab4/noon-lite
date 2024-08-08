import { Schema, model } from 'mongoose'

const modelSchema = new Schema({
    user: { type: Schema.Types.ObjectId,
        ref: 'User'
    },
    orderItems: [{
        product: { type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true },
    status: { type: String, required: true, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
    paymentMethod: { type: String,enum:['cash','card'],default: 'cash' },
    shippingAddress: {
        city: String,
        country: String,
        street: String,
        zipCode: String
    },
    shippingFee: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    deliveredAt: {
        type: Date,
    }
    
})

export const Order = model('Order', modelSchema)
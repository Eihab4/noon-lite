import { Schema,model } from "mongoose";


const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    cartItems: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
                min: 1,
            },
            price: {
                type: Number,
            }
        },
    ],
    totalPrice: {
        type: Number,

    },
    discount: {
        type: Number,
        default: 0,
    },
    priceAfterDiscount: {
        type: Number,
    }
})



export const Cart = model("Cart", cartSchema);
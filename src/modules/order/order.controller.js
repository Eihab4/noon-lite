import { Cart } from "../../../DataBase/models/cart.model.js";
import { Order } from "../../../DataBase/models/order.model.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import { AppError } from "../../utils/AppError.utils.js";
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51Pk7OoJzar188oGH99ftfMfDoHoybYsXMMRDKBLGm6jmxaXM4KJnzMRulrFrvDmTIQzaYa21N0IYmRBVKWqnMklC00Uq4nOE2R');


export const createCashOrder = catchError(async (req, res, next) => {
    let cart = await Cart.findOne({ user: req.user._id })
    if (!cart) return next(new AppError("User's cart not found", 404))
    
    let totalPrice = cart.priceAfterDiscount || cart.totalPrice  
    let order = await Order.create({
        user: req.user._id,
        orderItems: cart.cartItems,
        totalPrice,
        status: "pending"
    })
    await order.save();
    let options = cart.cartItems.map(item => {
        return ({
            updateOne:{
                "filter": { _id: item.product },
                "update": { $inc: { stock: -item.quantity,quantity:item.quantity } }
                
            }
        })
    })
    
    await Product.bulkWrite(options)
    res.status(200).json({ message: "Order created successfully", order })
    await Cart.findByIdAndDelete(cart._id);
})

export const getUserOrders = catchError(async (req, res, next) => {
    let orders = await Order.find({ user: req.user._id })
    if (!orders) return next(new AppError("User's orders not found", 404))
    res.status(200).json({ message: "User's orders", orders })
})

export const getAllOrders = catchError(async (req, res, next) => {
    let orders = await Order.find()
    if (!orders) return next(new AppError("Orders not found", 404))
    res.status(200).json({ message: "All orders", orders })
})

export const updateOrderStatus = catchError(async (req, res, next) => { 
    let order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    if (!order) return next(new AppError("Order not found", 404))
    res.status(200).json({ message: "Order status updated successfully", order })
})

export const createCheckoutSession = catchError(async (req, res, next) => {
    let cart = await Cart.findOne({
        user: req.user._id
    })
    if (!cart) return next(new AppError("User's cart not found", 404))
    
    let totalPrice = cart.priceAfterDiscount || cart.totalPrice
    let session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    product_data: {
                        name: req.user.name
                    },
                    unit_amount: totalPrice*100,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `https://www.facebook.com/`,
        cancel_url: `https://www.youtube.com/`,
        customer_email: req.user.email,
        metadata:req.body.shippingAddress,
        client_reference_id:cart._id,
        payment_method_types: ['card'],
    })
    res.status(200).json({ message: "Checkout session created successfully", session })
})
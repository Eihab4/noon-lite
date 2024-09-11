import { Cart } from "../../../DataBase/models/cart.model.js";
import { Coupon } from "../../../DataBase/models/coupon.model.js";
import { Product } from "../../../DataBase/models/product.model.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import { AppError } from "../../utils/AppError.utils.js";

import mongoose from 'mongoose';


/**
 * Calculates the total price of the items in the cart and applies any applicable discount.
 * 
 * @param {Object} cart - The user's cart object containing cartItems, totalPrice, and discount.
 * @throws Will throw an error if the cart data is invalid.
 */
function calculateTotalPrice(cart) {
    // Check if cart and cartItems are valid
    if (!cart || !Array.isArray(cart.cartItems)) {
        throw new Error('Invalid cart data');
    }

    // Calculate the total price of all items in the cart
    cart.totalPrice = cart.cartItems.reduce((total, item) => {
        const itemTotal = (item.price || 0) * (item.quantity || 0); // Default to 0 if undefined
        return total + (isNaN(itemTotal) ? 0 : itemTotal); // Ensure no NaN is added
    }, 0);

    // Apply discount if it's a positive number
    if (cart.discount > 0) {
        cart.priceAfterDiscount = cart.totalPrice - (cart.totalPrice * cart.discount / 100);
    } else {
        // If no valid discount, the priceAfterDiscount is the same as totalPrice
        cart.priceAfterDiscount = cart.totalPrice;
    }

    // Ensure priceAfterDiscount doesn't go below zero
    if (cart.priceAfterDiscount < 0) {
        cart.priceAfterDiscount = 0;
    }
}

/**
 * Adds items to the user's cart.
 * 
 * @param {Object} req - Express request object containing the cartItems and user information.
 * @param {Object} res - Express response object used to send the updated cart data back to the client.
 * @param {Function} next - Express next middleware function to handle errors.
 */
export const addToCart = catchError(async (req, res, next) => {
    // Ensure cartItems is an array and access the first item
    const cartItem = req.body.cartItems && req.body.cartItems[0];
    if (!cartItem) {
        return next(new AppError('No cart items provided', 400));
    }

    // Validate product ID
    const productId = cartItem.product;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(new AppError('Invalid product ID', 400));
    }

    // Retrieve the user's cart
    let cart = await Cart.findOne({ user: req.user._id });

    // Check if the cart exists
    if (!cart) {
        // If the cart does not exist, create a new one
        cart = new Cart({ user: req.user._id, cartItems: [cartItem] });
        calculateTotalPrice(cart);
        await cart.save();
    } else {
        // Find the item in the cart
        let item = cart.cartItems.find(item => item.product && item.product.toString() === productId);

        // Fetch the product's stock from the Product model
        const product = await Product.findById(productId);

        if (!product) {
            return next(new AppError('Product not found', 404));
        }

        // Check if the product's stock is sufficient
        if (item) {
            item.quantity += cartItem.quantity || 1;

            // Check if the new quantity exceeds the available stock
            if (item.quantity > product.stock) {
                return next(new AppError('Not enough stock available', 409));
            }
        } else {
            // Add the item to the cart
            if (cartItem.quantity > product.stock) {
                return next(new AppError('Not enough stock available', 409));
            }
            cart.cartItems.push(cartItem);
        }

        // Calculate total price after updating cart items
        calculateTotalPrice(cart);
        
        // Save the updated cart
        await cart.save();
    }

    // Respond with the updated cart
    res.status(200).json({ message: 'success', cart });
});

/**
 * Updates the quantity of a specific item in the user's cart.
 * 
 * @param {Object} req - Express request object containing the product ID and updated quantity.
 * @param {Object} res - Express response object used to send the updated cart data back to the client.
 * @param {Function} next - Express next middleware function to handle errors.
 */
export const updateQuantity = catchError(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }
  
  const productId = req.params.id; // Ensure this ID is correct
  let item = cart.cartItems.find(item => item.product == productId);
  
  if (!item) {
    return next(new AppError(`Product with ID ${req.params.id} not found in cart`, 404));
  }
  
  // Validate quantity
  if (typeof req.body.quantity !== 'number' || req.body.quantity <= 0) {
    return next(new AppError('Invalid quantity', 400));
  }
  
  item.quantity = req.body.quantity;
  calculateTotalPrice(cart);
  await cart.save();
  
  res.status(200).json({
    status: 'success',
    data: {
      cart
    }
  });
});

/**
 * Removes an item from the user's cart.
 * 
 * @param {Object} req - Express request object containing the item ID to be removed.
 * @param {Object} res - Express response object used to send the updated cart data back to the client.
 * @param {Function} next - Express next middleware function to handle errors.
 */
export const removeFromCart = catchError(async (req, res, next) => {
    let cart = await Cart.findOneAndUpdate({ user: req.user._id }, {
        $pull: { cartItems: { _id: req.params.id } },
    }, { new: true });
    
    if (!cart) {
        return next(new AppError('Cart not found', 404));
    }

    calculateTotalPrice(cart);
    await cart.save();
    
    res.status(200).json({ message: 'Product removed from cart', cart }); 
});

/**
 * Retrieves all items in the user's cart.
 * 
 * @param {Object} req - Express request object containing the user information.
 * @param {Object} res - Express response object used to send the cart items back to the client.
 * @param {Function} next - Express next middleware function to handle errors.
 */
export const getCartItems = catchError(async (req, res, next) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');
    
    if (!cart) {
        return next(new AppError('Cart not found', 404));
    }

    res.status(200).json({ message: 'Cart items', cart });
});

/**
 * Clears all items in the user's cart.
 * 
 * @param {Object} req - Express request object containing the user information.
 * @param {Object} res - Express response object used to send a success message back to the client.
 * @param {Function} next - Express next middleware function to handle errors.
 */
export const clearCart = catchError(async (req, res, next) => {
    let cart = await Cart.findOneAndDelete({ user: req.user._id });
    
    if (!cart) {
        return next(new AppError('Cart not found', 404));
    }

    res.status(200).json({ message: 'Cart cleared', cart });
});

/**
 * Applies a coupon to the user's cart if the coupon is valid and not expired.
 * 
 * @param {Object} req - Express request object containing the coupon code.
 * @param {Object} res - Express response object used to send the updated cart data back to the client.
 * @param {Function} next - Express next middleware function to handle errors.
 */
export const applyCoupon = catchError(async (req, res, next) => {
    // Find the coupon by code and check if it's not expired
    const coupon = await Coupon.findOne({ code: req.body.code, endDate: { $gte: Date.now() } });
    
    if (!coupon) {
        return next(new AppError('Coupon not found or expired', 404));
    }

    // Update the cart with the discount
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
        return next(new AppError('Cart not found', 404));
    }

    cart.discount = coupon.discount;

    // Recalculate prices after applying the discount
    calculateTotalPrice(cart);

    // Save the updated cart
    await cart.save();
    
    // Send response
    res.status(200).json({
        message: 'Coupon applied successfully',
        cart
    });
});

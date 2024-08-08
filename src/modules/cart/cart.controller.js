import { Cart } from "../../../DataBase/models/cart.model.js";
import { Coupon } from "../../../DataBase/models/coupon.model.js";
import { Product } from "../../../DataBase/models/product.model.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import { AppError } from "../../utils/AppError.utils.js";


function calculateTotalPrice(cart) { 
  // Calculate the total price of all items in the cart
  cart.totalPrice = cart.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Apply discount if it's a positive number
  if (cart.discount > 0) {
    cart.priceAfterDiscount = cart.totalPrice - (cart.totalPrice * cart.discount / 100);
  } else {
    // If no valid discount, the priceAfterDiscount is the same as totalPrice
    cart.priceAfterDiscount = cart.totalPrice;
  }
}

export const addToCart = catchError(async (req, res, next) => {
  // Retrieve the user's cart
  let cart = await Cart.findOne({ user: req.user._id });

  // Check if the cart exists
  if (!cart) {
    // If the cart does not exist, create a new one
    cart = new Cart({ user: req.user._id, cartItems: [req.body] });
    calculateTotalPrice(cart)  
      await cart.save();
  } else {
    // Find the item in the cart
    let item = cart.cartItems.find(item => item.product === req.body.product);

    // Fetch the product's stock from the Product model
    const product = await Product.findById(req.body.product);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Check if the product's stock is sufficient
    if (item) {
      item.quantity += req.body.quantity || 1;
      
      // Check if the new quantity exceeds the available stock
      if (item.quantity > product.stock) {
        return next(new AppError('Not enough stock available', 409));
      }

    } else {
      // Add the item to the cart
      if (req.body.quantity > product.stock) {
        return next(new AppError('Not enough stock available', 409));
      }
      cart.cartItems.push(req.body);
    }
    calculateTotalPrice(cart)  
    // Save the updated cart
    await cart.save();
  }

  // Respond with the updated cart
  res.status(200).json({ message: 'success', cart });
});

export const updateQuantity = catchError(async (req, res, next) => {
    let cart = await Cart.findOne(req.params.id)
    if (!cart) {
      return next(new AppError('Cart not found', 404));
    }
    let item = cart.cartItems.find(item => item.product === req.params.id);
    if (!item) {
      return next(new AppError('Product not found in cart', 404));
    }
    item.quantity = req.body.quantity;
    calculateTotalPrice(cart)
    await cart.save();
})

export const removeFromCart = catchError(async (req, res, next) => {
    let cart = await Cart.findOneAndUpdate({ user: req.user._id }, {
        $pull: { cartItems: { _id: req.params.id } },
    }, { new: true })
    if (!cart) {
    return next(new AppError('Cart not found', 404));
    }
    calculateTotalPrice(cart)
    await cart.save();
    res.status(200).json({ message: 'Product removed from cart', cart }); 
})

export const getCartItems = catchError(async (req, res, next) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');
    if (!cart) {
    return next(new AppError('Cart not found', 404));
    }
    res.status(200).json({ message: 'Cart items', cart });
})

export const clearCart = catchError(async (req, res, next) => {
    let cart = await Cart.findOneAndDelete({ user: req.user._id });
    if (!cart) {
    return next(new AppError('Cart not found', 404));
    }
    res.status(200).json({ message: 'Cart cleared', cart });
})
export const applyCoupon = catchError(async (req, res, next) => {
  // Find the coupon by code and check if it's not expired
  const coupon = await Coupon.findOne({ code: req.body.code, expires: { $gte: Date.now() } });
  
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




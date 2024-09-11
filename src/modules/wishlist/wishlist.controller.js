import { User } from "../../../DataBase/models/user.model.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import { AppError } from "../../utils/AppError.utils.js";


export const addToWishlist = catchError(async (req, res, next) => {
    // Ensure req.body.product is a valid product ID
    if (!req.body.product || typeof req.body.product !== 'string') {
        return next(new AppError('Invalid product ID', 400));
    }

    let wishlist = await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { wishlist: req.body.product } }, // Correctly specify the wishlist field
        { new: true }
    );

    if (!wishlist) return next(new AppError('User not found', 404));
    
    return res.status(200).json({ message: 'Product added to wishlist', wishlist });
});


export const removeFromWishlist = catchError(async (req, res, next) => { 
    // Ensure req.body.product is a valid product ID
    if (!req.body.product || typeof req.body.product !== 'string') {
        return next(new AppError('Invalid product ID', 400));
    }

    let wishlist = await User.findByIdAndUpdate(
        req.user._id,
        { $pull: { wishlist: req.body.product } }, // Correctly specify the wishlist field
        { new: true }
    );

    if (!wishlist) return next(new AppError('User not found', 404));
    
    return res.status(200).json({ message: 'Product removed from wishlist', wishlist });
});


export const getWishlist = catchError(async (req, res, next) => { 
    let wishlist = await User.findById(req.user._id).populate('wishlist')
    if (!wishlist) return next(new AppError('user not exist', 404))
    return res.status(200).json({message:'user wishlist', wishlist})  // Return the populated wishlist of the user
})

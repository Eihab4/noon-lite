import { User } from "../../../DataBase/models/user.model.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import { AppError } from "../../utils/AppError.utils.js";


export const addToWishlist = catchError(async (req, res, next) => {
    let wishlist = await User.findByIdAndUpdate(req.user._id,
        {$addToSet:req.body.product},{new:true}
    )
    if (!wishlist) return next(new AppError('product not exist', 404))
    return res.status(200).json({message:'product added to wishlist'})  // Return the updated wishlist with the added product
})

export const removeFromWishlist = catchError(async (req, res, next) => { 
    let wishlist = await User.findByIdAndUpdate(req.user._id,
        {$pull:req.body.product},{new:true}
    )
    if (!wishlist) return next(new AppError('product not exist', 404))
    return res.status(200).json({message:'product removed from wishlist'})
})

export const getWishlist = catchError(async (req, res, next) => { 
    let wishlist = await User.findById(req.user._id).populate('wishlist')
    if (!wishlist) return next(new AppError('user not exist', 404))
    return res.status(200).json({message:'user wishlist', wishlist})  // Return the populated wishlist of the user
})

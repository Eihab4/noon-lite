import { User } from "../../../DataBase/models/user.model.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import { AppError } from "../../utils/AppError.utils.js";


export const addAddress = catchError(async (req, res, next) => {
    let address = await User.findByIdAndUpdate(req.user._id, {
        $push: { addresses: req.body }
    }, { new: true })
    if (!address) return next(new AppError("User not found", 404))
    res.status(200).json({ message: "Address added successfully", address })
})

export const removeAddress = catchError(async (req, res, next) => { 
    let address = await User.findByIdAndUpdate(req.user._id, {
        $pull: { addresses: { _id: req.params.id } }
    }, { new: true })
    if (!address) return next(new AppError("Address not found or user not authorized", 404))
    res.status(200).json({ message: "Address removed successfully", address })
})

export const getAddresses = catchError(async (req, res, next) => { 
    let addresses = await User.findById(req.user._id).select('addresses');
    if (!addresses) return next(new AppError("User not found", 404))
    res.status(200).json({ message: "Addresses retrieved successfully", addresses })
})

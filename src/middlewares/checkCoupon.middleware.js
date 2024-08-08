import { Coupon } from "../../DataBase/models/coupon.model.js";
import { catchError } from "./catchError.middleware.js";


export const checkCoupon = catchError(async (req, res, next) => {
    // Check if coupon code exists in the database
    const coupon = await Coupon.findOne({ code: req.body.code });
    if (!coupon) return next(new AppError("Coupon not found", 404));
    // Check if coupon is valid for the current date
    if (coupon.startDate > new Date() || coupon.endDate < new Date()) {
        return next(new AppError("Coupon is not valid", 400));
    }
    next();
})
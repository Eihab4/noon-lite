import { Coupon } from "../../DataBase/models/coupon.model.js";
import { AppError } from "../utils/AppError.utils.js";
import { catchError } from "./catchError.middleware.js";


export const checkCoupon = catchError(async (req, res, next) => {
    const { code, discount, startDate, endDate } = req.body;

    // Check if a coupon with the same code already exists in the database
    const existingCoupon = await Coupon.findOne({ code });

    // If the coupon already exists, return an error
    if (existingCoupon) {
        return next(new AppError('Coupon with this code already exists', 409));
    }

    // Get the current date
    const currentDate = new Date();

    // Validate the date range for the new coupon
    if (new Date(startDate) < currentDate) {
        return next(new AppError("Start date must be in the future", 400));
    }
    if (new Date(endDate) <= new Date(startDate)) {
        return next(new AppError("End date must be after the start date", 400));
    }

    // If all checks pass, proceed to add the new coupon
    const newCoupon = await Coupon.create({ code, discount, startDate, endDate });
    
    // Optionally, you can send a response with the created coupon
    res.status(201).json({
        status: 'success',
        data: {
            coupon: newCoupon
        }
    });

    // Call the next middleware
    next();
});

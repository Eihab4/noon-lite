import { Coupon } from "../../../DataBase/models/coupon.model.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import { AppError } from "../../utils/AppError.utils.js";
import { deleteOne, getOneById } from "../handlers/refactor.handler.js";

export const addCoupon = catchError(async (req, res, next) => {
    const coupon = new Coupon(req.body)
    await coupon.save()
    res.status(201).json({ message: "Coupon added successfully", coupon })
})

export const getAllCoupons = catchError(async (req, res, next) => {
    const coupons = await Coupon.find()
    res.status(200).json({ message: "Coupons retrieved successfully", coupons })
})

export const getCouponById = getOneById(Coupon)

export const updateCoupon = catchError(async (req, res, next) => {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!coupon) return next(new AppError("Coupon not found", 404))
    res.status(200).json({ message: "Coupon updated successfully", coupon })
})

export const deleteCoupon = deleteOne(Coupon)

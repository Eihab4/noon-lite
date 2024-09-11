import { Review } from "../../../DataBase/models/review.model.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import ApiFeature from "../../utils/ApiFeature.utils.js";
import { AppError } from "../../utils/AppError.utils.js";
import {  getOneById } from "../handlers/refactor.handler.js";

export const addReview = catchError(async (req, res, next) => {
    req.body.user = req.user._id;
    const exists = await Review.findOne({ user: req.user._id, product: req.body.product })
    if (exists) return next(new AppError("You have already reviewed this product", 400));
    const review = new Review(req.body);
    await review.save();
    res.status(201).json({ message: "Review added successfully", review });
})

export const getAllReviews = catchError(async (req, res, next) => {
    const mongooseQuery = Review.find({product:req.params.id});
    let apiFeature = new ApiFeature(mongooseQuery, req.query).filter().paginate();
    const reviews = await apiFeature.MongooseQuery;
    res.status(200).json({ message: "Reviews retrieved successfully", reviews });
    
});

export const getReviewById = getOneById(Review)


export const updateReview = catchError(async (req, res, next) => { 
    const review = await Review.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new:true});
    if (!review) return next(new AppError("Review not found or you are not authorized", 404));
    res.status(200).json({ message: "Review updated successfully", review });
})

export const deleteReview = catchError(async (req, res, next) => { 
    const review = await Review.findOneAndDelete({_id:req.params.id,user:req.user._id},);
    if (!review) return next(new AppError("Review not found or you are not authorized", 404));
    res.status(200).json({ message: "Review updated successfully", review });
})

import { User } from "../../DataBase/models/user.model.js";
import { AppError } from "../utils/AppError.utils.js";
import { catchError } from "./catchError.middleware.js";


export const checkEmail = catchError(async (req, res, next) => {
    // Check if email already exists in the database
    const user = await User.findOne({ email: req.body.email });
    if (user) return next(new AppError("Email already in use", 400));
    next();
})
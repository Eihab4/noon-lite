import { User } from "../../../DataBase/models/user.model.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { AppError } from "../../utils/AppError.utils.js";


export const signUp = catchError(async (req, res, next) => {
    let user = new User(req.body)
    await user.save()
    let token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY)
    res.status(201).json({ message: "User created successfully", user, token })
})

export const signIn = catchError(async (req, res, next) => {
    let user = await User.findOne({ email: req.body.email })
    if (!user || !(await user.comparePassword(req.body.password))) return next(new AppError('invalid Email or Password',409))
    let token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY)
    res.json({ message: "User logged in successfully", user, token })
})

export const changePassword = catchError(async (req, res, next) => {
    // Find user by ID
    let user = await User.findById(req.user._id);
    
    // Check if user exists
    if (!user) {
        return next(new AppError('User not found', 404));
    }
    
    // Compare current password
    const isMatch = bcrypt.compareSync(req.body.currentPassword, user.password);
    if (!isMatch) {
        return next(new AppError('Invalid current password', 401));
    }
    
    // Update the password
    user.password = req.body.newPassword;
    user.passwordChangedAt = Date.now();
    
    // Save updated user
    await user.save();
    
    res.json({ message: "Password updated successfully", user });
});


export const protectedRoutes = catchError(async (req, res, next) => {
    // Extract JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('Token is required', 401));
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token and decode the payload
    const userPayload = jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) return next(new AppError('Invalid token', 401));
        return decoded;
    });

    // Check if user exists
    const user = await User.findById(userPayload.userId);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    // Check if password was changed after the token was issued
    const passwordChangedAt = user.passwordChangedAt ? parseInt(user.passwordChangedAt.getTime() / 1000) : 0;
    if (passwordChangedAt > userPayload.iat) {
        return next(new AppError('Password reset token has expired', 401));
    }
    req.user = user;
    next();
});

export const allowedTo = (...roles) => {
    return catchError(async(req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        return next();
    })
}

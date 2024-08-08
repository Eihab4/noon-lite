import { User } from "../../../DataBase/models/user.model.js";
import { catchError } from "../../middlewares/catchError.middleware.js";
import ApiFeature from "../../utils/ApiFeature.utils.js";
import { AppError } from "../../utils/AppError.utils.js";
import { deleteOne, getOneById } from "../handlers/refactor.handler.js";

export const addUser = catchError(async (req, res, next) => {
    // Add user to the database
    const user = new User(req.body);
    await user.save();  // Save the user to the database
    res.status(201).json({ message: "User added successfully", user });
});

export const getAllUsers = catchError(async (req, res, next) => { 
    // Find all users in the database
    const MongooseQuery = User.find();
    let apiFeature = new ApiFeature(MongooseQuery, req.query).filter().paginate() // use features you want
    const users = await apiFeature.MongooseQuery; // execute the query
    res.status(200).json({ message: "Users retrieved successfully", users });
})

export const getUserById = getOneById(User)

export const deleteUser = deleteOne(User)

export const updateUser = catchError(async (req, res, next) => { 
    // Update user by ID in the database
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return next(new AppError("User not found",404));
    res.status(200).json({ message: "User updated successfully", user });
})
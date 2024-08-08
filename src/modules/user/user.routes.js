import { Router } from "express";
import { addUser, deleteUser, getAllUsers, getUserById, updateUser } from "./user.controller.js";
import { checkEmail } from "../../middlewares/checkEmail.middleware.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { addUserValidation, deleteUserValidation, getUserByIdValidation, updateUserValidation } from "./user.validation.js";

export const userRouter = Router();
userRouter.use(protectedRoutes,allowedTo('admin'))

userRouter.post('/',checkEmail ,validate(addUserValidation),addUser)
userRouter.get('/',getAllUsers)
userRouter.get('/:id', validate(getUserByIdValidation),getUserById)
userRouter.put('/:id', validate(updateUserValidation),updateUser)
userRouter.delete('/:id', validate(deleteUserValidation),deleteUser)





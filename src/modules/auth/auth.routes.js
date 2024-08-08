import { Router } from "express";
import { allowedTo, changePassword, protectedRoutes, signIn, signUp } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { changePasswordValidation, signInValidation, signUpValidation } from "./auth.validation.js";


export const authRouter = Router();
authRouter.post('/', validate(signUpValidation),signUp)
authRouter.post('/',validate(signInValidation),signIn)
authRouter.put('/', protectedRoutes, allowedTo('user'), validate(changePasswordValidation),changePassword)




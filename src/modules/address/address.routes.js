import { Router } from "express";
import { addAddress, getAddresses, removeAddress } from "./address.controller.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";


export const addressRouter = Router();

addressRouter.patch('/', protectedRoutes, allowedTo('user'), addAddress)
addressRouter.delete('/', protectedRoutes, allowedTo('user', 'admin'),removeAddress )
addressRouter.get('/', protectedRoutes, allowedTo('user','admin'), getAddresses)
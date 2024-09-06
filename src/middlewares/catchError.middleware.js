import { AppError } from "../utils/AppError.utils.js";

export function catchError(callback) {
    return async (req, res, next) => {
        try {
            await callback(req, res, next); // Ensure callback is awaited if it returns a promise
        } catch (err) {
            console.log(err)
            next(new AppError(err,500)); // Pass any caught error to the next error-handling middleware
        }
    };
}
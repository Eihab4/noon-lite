import { AppError } from "../utils/AppError.utils.js";

export const validate = (schema) => {
    return (req, res, next) => {
        let filter = {}
        if (req.file) {
            filter = { image:req.file,...req.body, ...req.params}
        }
        else if (req.files) {
            filter={imageCover:req.files.imageCover,images:req.files.images, ...req.params,...req.body}
        }
        else {
            filter = {...req.params,...req.body}
        }
        const { error } = schema.validate(filter, { abortEarly: false });

        if (!error) {
            next(); // Proceed to the next middleware
        } else {
            const errorMessagesArray = error.details.map(err => err.message);
            next(new AppError(errorMessagesArray, 401));
        }
    };
};
import { AppError } from "../utils/AppError.utils.js";

export const validate = (schema) => {
    return (req, res, next) => {
        let filter = {};
        console.log(req.files)
        // For single file upload
        if (req.file) {
            filter = { 
                imageCover: req.file, 
                ...req.body, 
                ...req.params 
            };
        }
        // For multiple files upload
        else if (req.files) {
            filter = { 
                imageCover: req.files.imageCover ? req.files.imageCover[0] : undefined,
                images: req.files.images ? req.files.images : [],
                ...req.body, 
                ...req.params 
            };
        }
        // No file upload
        else {
            filter = { 
                ...req.body, 
                ...req.params 
            };
        }

        // Validate the data against the schema
        const { error } = schema.validate(filter, { abortEarly: false });
        console.log(error)
        if (!error) {
            next(); // Proceed to the next middleware
        } else {
            const errorMessagesArray = error.details.map(err => err.message);
            next(new AppError(errorMessagesArray.join(', '), 400)); // Send error as a single message
        }
    };
};

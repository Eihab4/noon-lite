import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "../utils/AppError.utils.js"; 

const fileUpload = (folderName) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, `uploads/${folderName}`);
        },
        filename: (req, file, cb) => {
            const uniqueFilename = uuidv4() + '-' + file.originalname;
            cb(null, uniqueFilename);
        }
    });

    // File filter function
    const fileFilter = (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new AppError('Only image files are allowed!', 400), false);
        }
    };

    const upload = multer({
        storage,
        fileFilter,
        limits: { fileSize: 1024 * 1024 * 5 } // 5MB
    });


    return upload;
}


export const uploadSingleFile = (fieldName,folderName) => {
    return fileUpload(folderName).single(fieldName);
};
export const uploadMultipleFiles = (fields,folderName) => { 
    return fileUpload(folderName).fields(fields);
}

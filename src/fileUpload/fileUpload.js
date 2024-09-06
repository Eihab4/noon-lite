import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../utils/AppError.utils.js';

// Function to configure Multer for file uploads
const fileUpload = (folderName) => {
    const storage = multer.diskStorage({
        // Define the destination for file storage
        destination: (req, file, cb) => {
            cb(null, `uploads/${folderName}`);
        },
        // Define the filename format
        filename: (req, file, cb) => {
            const uniqueFilename = uuidv4() + '-' + file.originalname;
            cb(null, uniqueFilename);
        }
    });

    // File filter to accept only image files
    const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new AppError('Only image files are allowed!', 400), false);
        }
    };

    // Multer configuration
    const upload = multer({
        storage,
        fileFilter,
        limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB
    });

    return upload;
};

// Export single file upload middleware
export const uploadSingleFile = (fieldName, folderName) => {
    return fileUpload(folderName).single(fieldName);
};

// Export multiple files upload middleware
export const uploadMultipleFiles = (fields, folderName) => { 
    return fileUpload(folderName).fields(fields);
};

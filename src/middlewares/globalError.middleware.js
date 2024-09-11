export const globalError = (err, req, res, next) => {


    let statusCode = err.statusCode || 500; // Default to 500 if no specific status code is provided
    if (statusCode < 100 || statusCode > 599) {
        statusCode = 500; // Ensure statusCode is within valid range if it's not set correctly
    }
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        stack: err.stack // Optionally include stack trace for debugging (not recommended for production)
    });
};
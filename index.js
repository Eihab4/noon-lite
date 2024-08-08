import express from 'express';
import dotenv from 'dotenv';

import { dbConnection } from './DataBase/dbConnection.js';
import { bootstrap } from './src/modules/bootstrap.js';
import { AppError } from './src/utils/AppError.utils.js';
import { globalError } from './src/middlewares/globalError.middleware.js';

// Load environment variables from .env file
 // Adjust path if necessary
dotenv.config();

// Initialize database connection
dbConnection; // Ensure this is initialized properly

const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Initialize application with bootstrap
bootstrap(app);

// Handle unknown routes
app.use('*', (req, res, next) => {
    next(new AppError(`Path Error at ${req.originalUrl}`, 404));
});

// Global error handler
app.use(globalError);

// Handle uncaught exceptions
process.on('uncaughtException', err => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

// Start the server
app.listen(port, () => console.log(`Server listening on port ${port}!`));

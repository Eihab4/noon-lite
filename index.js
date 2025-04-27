import express from 'express';
import dotenv from 'dotenv';

import { dbConnection } from './DataBase/dbConnection.js';
import { bootstrap } from './src/modules/bootstrap.js';
import { AppError } from './src/utils/AppError.utils.js';
import { globalError } from './src/middlewares/globalError.middleware.js';

dotenv.config();

dbConnection;

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/uploads', express.static('uploads'));

bootstrap(app);

app.use('*', (req, res, next) => {
    next(new AppError(`Path Error at ${req.originalUrl}`, 404));
});

app.use(globalError);

process.on('uncaughtException', err => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', err => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));

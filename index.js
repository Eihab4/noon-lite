process.on('uncaughtException', err => {
});

import express from 'express'
import { dbConnection } from './DataBase/dbConnection.js'
import { bootstrap } from './src/modules/bootstrap.js'
import { AppError } from './src/utils/AppError.utils.js'
import { globalError } from './src/middlewares/globalError.middleware.js'
const app = express()
const port = 3000
app.use(express.json())
app.use('/uploads', express.static('uploads'))
bootstrap(app)

app.use('*', (req, res, next) => {
    next(new AppError(`path Error at ${req.originalUrl}`,404))
})
app.use(globalError)
process.on('unhandledRejection', err => {
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
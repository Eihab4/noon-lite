import { connect } from 'mongoose'

export const dbConnection = connect("mongodb://localhost:27017/E-commerce", {
})
.then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error))
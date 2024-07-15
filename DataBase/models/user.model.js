import { Schema, model } from 'mongoose'


const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    isBlocked: { type: Boolean, default: false },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
})

export const User = model('User', userSchema)
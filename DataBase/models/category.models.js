import { Schema, model } from 'mongoose'


export const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength:[3,'two short for category name']
    },
    slug: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    image: [{
        type: String,
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    versionKey:false
})

export const Category = model('Category', categorySchema)
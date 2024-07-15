import { Schema, model } from 'mongoose'


export const brandSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength:[3,'two short for brand name']
    },
    slug: {
        type: String,
        lowercase: true,
        required: true
    },
    logo: {
        type: String
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},
    {
    timestamps: true,
    versionKey:false
})

export const Brand = model('Brand', brandSchema)
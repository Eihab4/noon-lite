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

brandSchema.post("init", (docs) => {
    if (docs.logo) {
        docs.logo = `http://localhost:3000/uploads/brands/${docs.logo}`;
    }
})

export const Brand = model('Brand', brandSchema)
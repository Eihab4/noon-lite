import { Schema, model } from 'mongoose'


export const subCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength:[3,'two short for sub category name']
    },
    slug: {
        type: String,
        lowercase: true,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
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

export const SubCategory = model('SubCategory', subCategorySchema)
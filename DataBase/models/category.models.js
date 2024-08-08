import { Schema, model } from 'mongoose'

export const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: [3, 'too short for category name']
    },
    slug: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },
    image: {
        type: String,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    versionKey: false
})

categorySchema.post('init', function (doc) {
    try {
        if (doc.image) {
            doc.image = process.env.BASE_URL + `categories/${doc.image}`;
        }
    } catch (error) {
        console.error('Error processing category document:', error);
    }
});
export const Category = model('Category', categorySchema);

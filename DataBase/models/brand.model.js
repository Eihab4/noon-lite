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

brandSchema.post('init', (doc) => {
    try {
        if (doc.logo) {
            console.log(process.env.BASE_URL)
            doc.logo = process.env.BASE_URL + `brands/${doc.logo}`;
        }
    } catch (error) {
        console.error('Error processing brand document:', error);
    }
});

export const Brand = model('Brand', brandSchema)
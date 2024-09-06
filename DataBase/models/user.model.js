import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    isBlocked: { type: Boolean, default: false },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    passwordChangedAt: {
        type: Date
    },
    confirmEmail: {
        type: Boolean,
        default: false
    },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    addresses: [{
        city: String,
        phone: String,
        street:String
    }]
});

userSchema.pre('findOneAndUpdate',  function (next) {
    if (this._update.password) {
        const hashedPassword =  bcrypt.hashSync(this._update.password, 10);
        this._update.password = hashedPassword;
    }
    next();
});

userSchema.pre('save',  function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

export const User = model('User', userSchema);

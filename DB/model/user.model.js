import { model, Schema } from 'mongoose';
import { mongoose } from 'mongoose';
const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    universityId: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
                if (this.role === 'student') return /^\d{8}$/.test(value);
                if (this.role === 'doctor') return /^\d{4}$/.test(value);
                return true;
            },
            message: props => `Invalid university ID (${props.value}) for role: ${props.instance.role}`
        }
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    college: {
        type: String,
    },
    profileImage: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    dateOfBirth: { type: Date },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
    },
    status: {
        type: String,
        enum: ['Active', 'NotActive'],
        default: 'Active'
    },
    role: {
        type: String, enum: ['student', 'doctor', 'admin' , 'superAdmin'],
        required: true,
        default: 'student'
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    sendCode: { type: String, default: null },
    confirmEmail: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const userModel = mongoose.models.User || model('User', userSchema);
export default userModel;
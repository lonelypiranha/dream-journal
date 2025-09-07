import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name required'],
        trim: false,
    },
    email: {
        type: String,
        required: [true, 'Email required'],
        trim: false,
    },
    password: {
        type: String,
        required: [true, 'Password required'],
        trim: false,
    },
    lastActive: {
        type: Date,
        required: [true, 'Last active date required'],
        trim: false,
    },
    lastDreamed: {
        type: Date,
        required: false,
        trim: false,
    },
    currentStreak: {
        type: Number,
        required: [true, 'Password required'],
        trim: false,
    },
    highestStreak: {
        type: Number,
        required: [true, 'Password required'],
        trim: false,
    },
}, { timestamps: true})

const User = mongoose.model('User', userSchema);
export default User;
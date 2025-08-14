import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    full_name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true
    },
    bio: {
        type: String,
        default: 'Hey there! I am using Connext.'
    },
    profile_picture: {
        type: String,
        default: ''
    },
    cover_photo: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    followers: [{ 
        type: String, 
        ref: 'User'  // This ref will work since _id is String
    }],
    following: [{ 
        type: String, 
        ref: 'User'  // This ref will work since _id is String
    }],
    connections: [{ 
        type: String, 
        ref: 'User'  // This ref will work since _id is String
    }]
}, { timestamps: true, minimize: false });

const User = mongoose.model("User", userSchema);

export default User;
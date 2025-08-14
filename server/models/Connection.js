import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
    from_user_id: {
        type: String,  // Changed from ObjectId to String for Clerk
        required: true,
    },
    to_user_id: {
        type: String,  // Changed from ObjectId to String for Clerk
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted'],
        default: 'pending',
    },
}, {timestamps: true})

const Connection = mongoose.model('Connection', connectionSchema)

export default Connection;
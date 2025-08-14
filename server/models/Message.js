import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    from_user_id: {
        type: String,  // Changed from ObjectId to String for Clerk
        required: true
        
    },
    to_user_id: {
       type: String,  // Changed from ObjectId to String for Clerk
        required: true
    },
    text: {
        type: String,
        trim: true
    },
    message_type: {
        type: String,
        enum: ['text', 'image']
    },
    media_url: {
        type: String
    },
    seen:{
        type: Boolean,
        default: false
    }
},{timestamps: true, minimize: false})

const Message = mongoose.model('Message', messageSchema)

export default Message;
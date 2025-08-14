import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    user: {
        type: String,  // Changed from ObjectId to String for Clerk
        required: true
    },
    content: {
        type: String,
    },
    media_url: [{
        type: String,
    }],
    media_type: {
        type: String,
        enum: ['text', 'image', 'video'],
    },
    views_count: [{
        type: String,  // Changed from ObjectId to String for Clerk
    }],
    background_color: {
        type: String,
    },
}, {timestamps: true, minimize: false})

const Story = mongoose.model('Story', storySchema)

export default Story;
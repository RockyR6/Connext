import fs from 'fs'
import imagekit from '../config/imageKit.js'
import Message from "../models/Message.js";

// create an empty object to store SSE connections
const connections = {};

// SSE controller
export const sseController = (req, res) => {
    const { userId } = req.params;
    console.log('New client connected: ', userId);

    // set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // add this client connection
    connections[userId] = res;

    //  send valid JSON instead of plain text
    res.write(`data: ${JSON.stringify({ status: "connected" })}\n\n`);

    // handle client disconnect
    req.on('close', () => {
        delete connections[userId];
        console.log('Client disconnected:', userId);
    });
};

// send message
export const sendMessage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { to_user_id, text } = req.body;
        const image = req.file;

        let media_url = '';
        let message_type = image ? 'image' : 'text';

        if (message_type === 'image') {
            const fileBuffer = fs.readFileSync(image.path);
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: image.originalname
            });

            media_url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '1280' },
                ]
            });

            // clean up local uploaded file
            fs.unlinkSync(image.path);
        }

        const message = await Message.create({
            from_user_id: userId,
            to_user_id,
            text,
            message_type,
            media_url
        });

        res.json({ success: true, message });

        // populate sender info for frontend
        const messageWithUserData = await Message.findById(message._id)
            .populate('from_user_id');

        //  send message to receiver if connected
        if (connections[to_user_id]) {
            try {
                connections[to_user_id].write(
                    `data: ${JSON.stringify(messageWithUserData)}\n\n`
                );
            } catch (sseError) {
                console.log('SSE write error (receiver):', sseError);
                delete connections[to_user_id];
            }
        }

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// get chat messages
export const getChatmessages = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { to_user_id } = req.body;

        const messages = await Message.find({
            $or: [
                { from_user_id: userId, to_user_id },
                { from_user_id: to_user_id, to_user_id: userId }
            ]
        }).sort({ createdAt: -1 });

        // mark as seen
        await Message.updateMany(
            { from_user_id: to_user_id, to_user_id: userId },
            { seen: true }
        );

        res.json({ success: true, messages });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

// get recent messages for logged-in user
export const getUserRecentMessages = async (req, res) => {
    try {
        const { userId } = req.auth();
        const messages = await Message.find({ to_user_id: userId })
            .populate('from_user_id to_user_id')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            messages
        });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message,
        });
    }
};

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import { inngest, functions } from './inngest/index.js';
import { serve } from 'inngest/express';
import { clerkMiddleware } from '@clerk/express'
import userRouter from './routes/userRoutes.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())

// Root route
app.get('/', (req, res) => res.send('Server is running'));
app.use('/api/user', userRouter)

// Start server after DB connection
const startServer = async () => {
    try {
        await connectDB();
        console.log("MongoDB connected");

        // Set up the "/api/inngest" routes
        app.use("/api/inngest", serve({ client: inngest, functions }));

        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    } catch (err) {
        console.error(" Error starting server:", err);
        process.exit(1);
    }
};

startServer();

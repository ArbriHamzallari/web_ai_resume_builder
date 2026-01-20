import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
await connectDB()

// CORS Configuration - CRITICAL for production
const corsOptions = {
    origin: [
        'https://resume-frontend-5pbi.onrender.com',
        'https://web-ai-resume-builder.vercel.app',
        process.env.FRONTEND_URL, // Allow frontend URL from environment variable
        'http://localhost:5173',
        'http://localhost:3000'
    ].filter(Boolean), // Remove any undefined values
    credentials: true, // CRITICAL: Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization']
}

app.use(cors(corsOptions))
app.use(cookieParser()) // CRITICAL: Parse cookies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res)=> res.send("Server is live..."))
app.use('/api/users', userRouter)
app.use('/api/resumes', resumeRouter)
app.use('/api/ai', aiRouter)
app.use('/api/payments', paymentRouter)

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    
});
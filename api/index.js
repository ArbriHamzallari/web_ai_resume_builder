// Vercel serverless function wrapper for Express app
// This file must be in /api directory for Vercel to recognize it as a serverless function

// Import the Express app (not the server startup code)
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "../server/configs/db.js";
import userRouter from "../server/routes/userRoutes.js";
import resumeRouter from "../server/routes/resumeRoutes.js";
import aiRouter from "../server/routes/aiRoutes.js";
import paymentRouter from "../server/routes/paymentRoutes.js";

const app = express();

// Database connection - optimized for serverless
let dbInitialized = false;

const initializeDB = async () => {
  if (!dbInitialized) {
    try {
      await connectDB();
      dbInitialized = true;
    } catch (error) {
      console.error("DB initialization error:", error);
      // Don't throw - allow retry on next request
    }
  }
};

// Initialize DB on cold start
initializeDB();

app.use(express.json());
app.use(cors());

// Ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  await initializeDB();
  next();
});

// Health check
app.get('/', (req, res) => res.json({ message: "API is live..." }));

// API routes
// Note: Vercel routes /api/* requests to this function, and Express
// receives the full path including /api prefix, so routes are correct as-is
app.use('/api/users', userRouter);
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);
app.use('/api/payments', paymentRouter);

// Export for Vercel serverless
export default app;


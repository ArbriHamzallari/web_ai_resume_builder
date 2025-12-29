import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";

const app = express();

// Database connection - handle both serverless and traditional server
let dbConnected = false;
const ensureDBConnection = async () => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
};

// Initialize DB connection
ensureDBConnection().catch(console.error);

app.use(express.json())
app.use(cors())

// Health check endpoint
app.get('/', (req, res)=> res.send("Server is live..."))
app.get('/api', (req, res)=> res.json({ message: "API is live..." }))

// API routes
app.use('/api/users', userRouter)
app.use('/api/resumes', resumeRouter)
app.use('/api/ai', aiRouter)
app.use('/api/payments', paymentRouter)

// Ensure DB connection before handling requests
app.use(async (req, res, next) => {
  await ensureDBConnection();
  next();
});

// For Vercel serverless: export the app
export default app;

// For traditional server: start listening
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
  });
}
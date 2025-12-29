import mongoose from "mongoose";

// Cache the connection to reuse in serverless environments
let cachedConnection = null;

const connectDB = async () => {
    try {
        // Reuse existing connection if available (important for serverless)
        if (cachedConnection && mongoose.connection.readyState === 1) {
            return cachedConnection;
        }

        // If connection exists but not ready, close it first
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
        }

        mongoose.connection.on("connected", ()=>{console.log("Database connected successfully")})

        let mongodbURI = process.env.MONGODB_URI;
        const projectName = 'resume-builder';

        if(!mongodbURI){
            throw new Error("MONGODB_URI environment variable not set")
        }

        if(mongodbURI.endsWith('/')){
            mongodbURI = mongodbURI.slice(0, -1)
        }

        cachedConnection = await mongoose.connect(`${mongodbURI}/${projectName}`, {
            // Optimize for serverless
            maxPoolSize: 1, // Limit connections for serverless
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        })
        
        return cachedConnection;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error)
        throw error;
    }
}

export default connectDB;
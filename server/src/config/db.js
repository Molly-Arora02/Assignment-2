import mongoose from 'mongoose';

let mongoMemoryServer = null;

// Prevent Mongoose from hanging indefinitely on queries when DB is disconnected
mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 3000);

export const connectDB = async () => {
  // If already connected, reuse existing connection (crucial for Serverless/Vercel)
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const mongoURI = process.env.MONGODB_URI;

  if (mongoURI) {
    try {
      console.log('🔗 Connecting to external MongoDB database...');
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('✅ Connected to MongoDB successfully.');
      return mongoose.connection;
    } catch (error) {
      console.error('❌ MongoDB Connection Error:', error.message);
      throw error;
    }
  }

  // In production / Vercel, MONGODB_URI is required
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    console.warn('⚠️ MONGODB_URI environment variable is not set in Vercel settings.');
    return null;
  }

  // Local development fallback: dynamic import so it is never bundled into serverless builds
  try {
    console.log('📦 Starting In-Memory MongoDB Server (Local development & demo mode)...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();
    await mongoose.connect(uri);
    console.log('✅ Connected to In-Memory MongoDB at:', uri);
    return mongoose.connection;
  } catch (error) {
    console.error('❌ In-Memory MongoDB Error:', error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
  } catch (error) {
    console.error('Error disconnecting database:', error);
  }
};

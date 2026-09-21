import { connectDB } from '../server/src/config/db.js';
import { seedDatabase } from '../server/src/services/seedService.js';
import app from '../server/src/app.js';

let isSeeded = false;

export default async function handler(req, res) {
  try {
    const conn = await connectDB();
    if (conn && !isSeeded && process.env.MONGODB_URI) {
      await seedDatabase();
      isSeeded = true;
    }
  } catch (err) {
    console.error('Database connection error in Vercel Serverless Function:', err);
  }
  return app(req, res);
}

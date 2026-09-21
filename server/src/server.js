import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { seedDatabase } from './services/seedService.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

// Start server
const startServer = async () => {
  await connectDB();
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 CampusConnect Server running on port ${PORT}`);
    console.log(`📡 Base API URL: http://localhost:${PORT}/api`);
    console.log(`======================================================\n`);
  });
};

startServer();

export default app;

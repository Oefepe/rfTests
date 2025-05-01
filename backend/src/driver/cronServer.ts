import connectDB from '../db/connection';
import { startCrons } from '../cron/cronConfig'; // Connect to the database

// Connect to the database
connectDB();

// Start cron jobs
startCrons();

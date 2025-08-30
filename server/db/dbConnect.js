import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function connectToDB() {
    try {
        await mongoose.connect(process.env.DB_STRING);
        console.log("Connected to DB");
    } catch (error) {
        throw new Error('Connection to DB Failed!');
    }
}

function checkDBConnection(req, res, next) {
  const readyState = mongoose.connection.readyState;
  if (readyState !== 1) {
    return res.status(503).json({ error: "Database not connected" });
  }
  next();
}

export { connectToDB, checkDBConnection };
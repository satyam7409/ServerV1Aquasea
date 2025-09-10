import dotenv from "dotenv";
import app from "./app.js";
import { connectDb } from "./src/db/index.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDb(); // connect to Supabase before starting server

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();

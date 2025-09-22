// src/middleware/multer.middleware.js
import { log } from "console";
import multer from "multer";

// Store uploaded files in memory so we can push them to Supabase directly
const storage = multer.memoryStorage();

export const upload = multer({ storage });

console.log("Multer middleware configured to use memory storage." );

import { supabase } from "../db/index.js";
import path from "path";
import axios from "axios"; // add axios for HTTP requests
import { v4 as uuidv4 } from 'uuid';


export const uploadFasta = async (req, res) => {
  console.log("--- Starting uploadFasta controller ---");
  try {
    if (!req.file) {
      console.log("❌ Error: No file was present in the request.");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("📄 File received:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    const file = req.file;
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}${fileExt}`;
    const filePath = `fasta/${fileName}`;

    // 1. Upload file to Supabase Storage
    console.log(`📤 Uploading file to Supabase at path: ${filePath}`);
    const { error } = await supabase.storage
      .from("files")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error("❌ Supabase upload error:", error);
      throw error;
    }
    console.log("✅ File successfully uploaded to Supabase.");

    // 2. Get public URL
    const { data } = supabase.storage.from("files").getPublicUrl(filePath);
    const fileUrl = data.publicUrl;
    console.log("🔗 Generated public URL:", fileUrl);

    // 3. Call Python ML Service with the file URL
    console.log(
      "🚀 Sending request to Python ML Service at http://localhost:8000/predict"
    );
    const mlResponse = await axios.post("http://localhost:8000/predict", {
      file_url: fileUrl,
    });
    console.log("🧠 Received response from ML Service:", mlResponse.data);

    // 4. Respond to frontend with ML predictions
    console.log("✅ Successfully processed. Sending final response to client.");
    return res.status(200).json({
      message: "File uploaded and processed successfully",
      fileUrl,
      predictions: mlResponse.data,
      // jobId: uuidv4(), // Generate a unique job ID for tracking
    });    
  } catch (err) {
    console.error("--- 💥 An error occurred in uploadFasta ---");
    // Log detailed error information
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error Data:", err.response.data);
      console.error("Error Status:", err.response.status);
      console.error("Error Headers:", err.response.headers);
    } else if (err.request) {
      // The request was made but no response was received
      console.error("Error Request:", err.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error Message:", err.message);
    }
    console.error("Full Error Object:", err);

    return res.status(500).json({
      message: "Upload or prediction failed",
      error: err.message,
    });
  }
};

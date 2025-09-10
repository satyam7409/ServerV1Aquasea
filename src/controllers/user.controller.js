import { supabase } from "../db/index.js";
import path from "path";

export const uploadFasta = async (req, res) => {
  console.log("--- Starting uploadFasta ---");
  try {
    console.log("Request received, checking for file...");
    if (!req.file) {
      console.log("No file found in the request.");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("File found:", req.file.originalname);
    const file = req.file;
    const fileExt = path.extname(file.originalname);
    const fileName = `${Date.now()}${fileExt}`;
    const filePath = `fasta/${fileName}`; // folder inside "files" bucket
    console.log("Generated file path for Supabase:", filePath);

    // Upload to Supabase storage bucket "files"
    console.log("Uploading to Supabase storage...");
    const { error } = await supabase.storage
      .from("files")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error.message);
      throw error;
    }
    console.log("File successfully uploaded to Supabase.");

    // Get public URL for the uploaded file
    console.log("Getting public URL...");
    const { data } = supabase.storage.from("files").getPublicUrl(filePath);
    console.log("Public URL data:", data.publicUrl);

    res.status(200).json({
      message: "File uploaded successfully",
      url: data.publicUrl,
    });
    console.log("--- uploadFasta finished successfully ---");
  } catch (err) {
    console.error("--- Error in uploadFasta ---");
    console.error("Upload error details:", err.message);
    res.status(500).json({
      message: "Upload failed",
      error: err.message,
    });
  }
};

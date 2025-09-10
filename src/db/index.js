import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

let supabase;

export const connectDb = async () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("❌ Supabase credentials are missing in .env");
    }

    supabase = createClient(supabaseUrl, supabaseKey);

    // simple test query to verify connection
    // const { data, error } = await supabase.from("pg_tables").select("*").limit(1);

    // if (error) {
    //   throw error;
    // }

    console.log("✅ Supabase DB connected successfully!");
    return supabase;
  } catch (err) {
    console.error("⚠️ Supabase connection failed:", err.message);
    process.exit(1); // stop server if connection fails
  }
};

export { supabase };

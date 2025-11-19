// server/utils/cloudinaryClient.js
import dotenv from "dotenv";
dotenv.config(); // Ensure .env is loaded BEFORE config

import { v2 as cloudinary } from "cloudinary";

// Debug logging — remove later if desired
console.log("🌥 Cloudinary Config Check:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: !!process.env.CLOUDINARY_API_KEY,
  api_secret: !!process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary securely
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Export default client
export default cloudinary;

// Optional: unsigned upload config for frontend usage if needed later
export function getUnsignedConfig() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET
  };
}

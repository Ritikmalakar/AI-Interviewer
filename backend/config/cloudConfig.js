import dotenv from 'dotenv'
dotenv.config()
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// 🔥 FORCE CONFIG (NO DEPENDENCY ISSUE)
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME ,
  api_key: process.env.CLOUD_API_KEY ,
  api_secret: process.env.CLOUD_API_SECRET ,
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // 🔥 EXPLICIT PASS
  params: async (req, file) => {
    return {
      folder: "uploads",
      allowed_formats: ["jpg", "png", "jpeg","pdf"],
    };
  },
});

export { cloudinary, storage };
//npm i cloudinary multer multer-storage-cloudinary

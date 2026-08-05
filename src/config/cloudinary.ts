// Require the cloudinary library
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true
});

// Upload single image
const uploadImage = async (file: Express.Multer.File) => {
  const options = {
    folder: "shopsphere/products",
    use_filename: true,
    unique_filename: true,
    overwrite: false,
  };

  const b64 = Buffer.from(file.buffer).toString("base64");
  const dataUri = `data:${file.mimetype};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataUri, options);
  return result.secure_url;
};

// Upload multiple images
const uploadImages = async (files: Express.Multer.File[]) => {
  return await Promise.all(files.map(async (file) => {
    return await uploadImage(file);
  }));
};

export default uploadImages;
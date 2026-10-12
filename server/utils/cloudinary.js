import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ override: false })

const requiredCloudinaryEnv = [
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET"
]

export const hasCloudinaryCredentials = (environment) =>
    requiredCloudinaryEnv.every((key) => Boolean(environment[key]));

export const isCloudinaryConfigured = hasCloudinaryCredentials(process.env);

if (isCloudinaryConfigured) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

export default cloudinary;
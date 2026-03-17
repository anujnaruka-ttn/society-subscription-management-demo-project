import { v2 as cloudinary } from 'cloudinary';
import { ENV as env } from '../validations/env.validation';

export const cloudinaryConnecter = () => {
    try {
        cloudinary.config({
            cloud_name: env.CLOUDINARY_CLOUD_NAME,
            api_key: env.CLOUDINARY_API_KEY,
            api_secret: env.CLOUDINARY_API_SECRET,
        });
    } catch (err: any) {
        console.log('Failed to connect to cloudinary...');
        console.log('Error: ', err);
        process.exit(1);
    }
};
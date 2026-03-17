import { v2 as cloudinary } from "cloudinary";
export const uploadToCloudinary = async (
    file: string,
    folderName: string,
    mediaQuality?: string,
    width?: number,
    height?: number
) => {
    try {
        console.log('Starting Cloudinary upload...');
        console.log('File path:', file);
        console.log('Folder name:', folderName);

        // Check if file path exists and is valid
        if (!file || typeof file !== 'string') {
            throw new Error('Invalid file path provided');
        }

        const options: any = {
            folder: folderName,
            resource_type: 'auto',
            quality: (mediaQuality || 'auto')
        };

        if (width && height) {
            options.width = width;
            options.height = height;
        }

        console.log('Upload options:', options);

        const result = await cloudinary.uploader.upload(file, options);
        console.log('Cloudinary upload successful:', result.secure_url);

        return result;
    } catch (error: any) {
        console.error('Cloudinary upload error:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            file: file,
            folderName: folderName
        });
        throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
};
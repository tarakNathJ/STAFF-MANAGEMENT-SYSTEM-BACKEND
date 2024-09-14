const cloudinary = require('cloudinary').v2

require('dotenv').config();
// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRATE // Click 'View API Keys' above to copy your API secret
});

exports.FileUploder = async(LocalFilePath) => {
    try {
        // Upload an image
        const uploadResult = await cloudinary.uploader
            .upload(
                LocalFilePath, {
                    public_id: 'Profile image',
                }
            )
            .catch((error) => {
                console.log(error);
            });

        return uploadResult;

    } catch (error) {
        return error;
    }

}
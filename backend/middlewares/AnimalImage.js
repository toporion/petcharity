const multer=require('multer')
const cloudinary=require('cloudinary').v2
const {CloudinaryStorage}=require('multer-storage-cloudinary')

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
    
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let folder = 'animalImage';
        return {
            folder: 'animal',
            allowedFormats: ['jpeg', 'png', 'jpg', 'pdf'], // Allow PDF for medical history
            resource_type: file.mimetype.includes("pdf") ? "raw" : "image" // Handle PDF uploads
        };
    }
});

const animalUpload=multer({storage})
module.exports=animalUpload;
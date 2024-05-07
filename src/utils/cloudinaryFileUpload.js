import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

// cloudinary configuration 

          
cloudinary.config({ 
  cloud_name: 'ddzpv93pv', 
  api_key: '392565727654746', 
  api_secret: 'aXwDWY1PfRxnAYVtfCH98KJr1Xo' 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // upload file to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        // file uploaded successfully
        fs.unlinkSync(localFilePath)
        return uploadResponse
    } catch (error) {
        fs.unlinkSync(localFilePath) // delete the file from the local storage after uploading to cloudinary failed 
        return error;
    }
}

export {
    uploadOnCloudinary
}
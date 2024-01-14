import {v2 as cloudinary} from "cloudinary"
//for file system
import fs from "fs"
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary= async (localFilePath)=>{
try{
    if(!localFilePath){
        return null;
    }
    console.log("workd fine till here ")
 const response =  await  cloudinary.uploader.upload(localFilePath,{
        resource_type:"auto"
    })
    //file uploaded successfully 
    
    // console.log("File is uploaded in cloudinary",response.url);
    fs.unlinkSync(localFilePath)
    return response;
}
catch(error){
    //remove locally saved temp files when upload operation fails.
fs.unlinkSync(localFilePath)
return null;
}
}

export { uploadOnCloudinary }
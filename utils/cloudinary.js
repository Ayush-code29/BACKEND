import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'
cloudinary.config({
cloud_name:"dzp1akzf4",
api_key:749766454384371,
api_secret:"31WWvyyrjlEw3PsWsGzomU4kLXc"
})

// console.log(process.env.CLOUDINARY_API_KEY);
// console.log(process.env.CLOUDINARY_API_SECRET);
// console.log(process.env.CLOUDINARY_CLOUD_NAME);
const uploadoncloudinary = async (localfilepath)=>{
    try {
        if(!localfilepath) return null
        //upload the file on cloudinary

       const response = await cloudinary.uploader.upload(localfilepath,{resource_type:"auto"})

        console.log("file is uploaded on cloudinary ",response.url)
        return response;

    } catch (error) {
        fs.unlinkSync(localfilepath)//remove the locally saved temporary files as the upload operation got failed
        return null;
    }
}

export{uploadoncloudinary}

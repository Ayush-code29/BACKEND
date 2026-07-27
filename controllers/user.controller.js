import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiEroor.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";
const registeruser = asynchandler(async(req,res,next)=>{
    // get user
    // validate the user
    // check if user already existss
    // check for images, check for avatar
    // upload them to cloudinary, avatar

    
    const {username,email,password,fullname} = req.body
    // console.log("Email is : ", email)
    if([fullname,username,email,password].some((field)=>{
        return field?.trim()===""

    })){
        throw new ApiError(400,"All fields are required")
    }
    const existinguser = await User.findOne({
        $or: [{username},{email}]
    })
    if(existinguser){
        throw new ApiError('409',"User already exists...")
    }

    const avatarlocalpath = req.files?.avatar[0]?.path;
    const coverimagelocalpath = req.files?.coverimage[0]?.path;
    if(!avatarlocalpath){
        throw new ApiError(400,"Avatar image is required")
    }

    console.log(avatarlocalpath,coverimagelocalpath)
   const avatar = await uploadoncloudinary(avatarlocalpath)
   const coverimage = await uploadoncloudinary(coverimagelocalpath)
   if(!avatar){
    throw new ApiError(400,"Avatar image is required")

   }
   const user = await User.create({fullname,avatar:avatar.url,coverimage:coverimage?.url || "", email,password,username:username.toLowerCase()});
  const createduser = await User.findById(user._id).select(
    "-password -refreshtoken"
  )
  if(!createduser){
    throw new ApiError(500,"Something went wrong while")
  }
  return res.status(201).json(
    new ApiResponse(200,createduser,"User Registered SuccessFully...")
  )
})
export {registeruser}
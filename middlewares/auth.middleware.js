import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiEroor.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyjwt = asynchandler(async(req,res,next)=>{
    const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ","")
    if(!token){
        throw new ApiError(401,"Unauthorised error")
    }
   const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
   const user = await User.findById(decoded?._id).select("-password -refreshtoken")
   if(!user){
    throw new ApiError(401,"Invalid access token")
   }
   req.user = user;
   next()
})
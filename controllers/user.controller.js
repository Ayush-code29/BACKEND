import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiEroor.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";
const generateaccessandrefreshtokens = async(userid)=>{
    try {
        const user = await User.findById(userid);
        const accesstoken = user.generateAccessToken()
        const refreshtoken = user.generateRefreshToken()
        user.refreshtoken = refreshtoken
        await user.save({validateBeforeSave:false})
        return {accesstoken,refreshtoken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}
const registeruser = asynchandler(async (req, res, next) => {

    // ===========================
    // DEBUGGING LOGS
    // ===========================
    console.log("========== REGISTER API ==========");
    console.log("Body:", req.body);
    console.log("Files:", req.files);

    // Get user data
    const { username, email, password, fullname } = req.body;

    // Validation
    if ([fullname, username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check existing user
    const existinguser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existinguser) {
        throw new ApiError(409, "User already exists...");
    }


    const avatarlocalpath = req.files?.avatar?.[0]?.path;
    const coverimagelocalpath = req.files?.coverimage?.[0]?.path;

    console.log("Avatar Local Path:", avatarlocalpath);
    console.log("Cover Local Path:", coverimagelocalpath);

    if (!avatarlocalpath) {
        throw new ApiError(400, "Avatar image is required");
    }

    console.log("Uploading Avatar...");
    const avatar = await uploadoncloudinary(avatarlocalpath);

    console.log("Avatar Response:", avatar);

    console.log("Uploading Cover Image...");
    const coverimage = await uploadoncloudinary(coverimagelocalpath);

    console.log("Cover Response:", coverimage);

    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed");
    }

    // ===========================
    // CREATE USER
    // ===========================
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverimage: coverimage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    console.log("Created User:", user);

    // ===========================
    // FETCH USER
    // ===========================
    const createduser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    console.log("Final User:", createduser);

    if (!createduser) {
        throw new ApiError(500, "Something went wrong while creating user");
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            createduser,
            "User Registered Successfully"
        )
    );
});

const loginuser = asynchandler(async(req,res)=>{
    const{email,username,password} = req.body;
    if(!(username || email)){
        throw new ApiError(400,"Username or email required")
    }
    const user = await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new ApiError(404,"User does not exist")
    }
    if(!password){
        throw new ApiError(400,"Password is required")
    }
    const ispasswordvalid = await user.isPasswordCorrect(password)
    if(!ispasswordvalid){
        throw new ApiError(401,"Invalid user credentials")
    }
   const {accesstoken,refreshtoken} = await generateaccessandrefreshtokens(user._id)
   const loggedinuser = await User.findById(user._id).select("-password -refreshtoken")
   const options = {
    httpOnly: true,
    secure:true,
   }
   return res.status(200).cookie("accesstoken",accesstoken,options).cookie("refreshtoken",refreshtoken,options).json(new ApiResponse(200,{
    user:loggedinuser,accesstoken,refreshtoken
   },"User logged in Successfully"))

})
const logoutuser = asynchandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,{$set:{
        refreshtoken:undefined
    }},{
        new:true
    })
    const options = {
    httpOnly: true,
    secure:true,
   }
return res.status(200).clearCookie("accesstoken",options).clearCookie("refreshtoken",options)
    
})

const changepassword = asynchandler(async(req,res)=>{
    const{oldpassword,newpassword} = req.body;
    const user = await User.findById(req.user?._id)
    const ispasswordcorrect = await user.ispasswordcorrect(oldpassword)
    if(!ispasswordcorrect){
        throw new ApiError(400,"Invalid old password")
    }
    user.password = newpassword;
    await user.save({validateBeforeSave:false})
    return res.status(200).json(new ApiResponse(200,{},'Password changed successfully'))
})
const getcurrentuser = asynchandler(async(req,res)=>{
    return res.status(200).json(200,req.user,"current user fetched")
})

const updateaccountdetails = asynchandler(async(req,res)=>{
    const{fullname,email} = req.body;
    if(!fullname || !email){
        throw new ApiError(400,"All fields are required")
    }
    const user = await User.findByIdAndUpdate(req.user?._id , {$set:{
        fullname:fullname,
        email:email
    }},{new:true}).select("-password")
    return res.status(200).json(new ApiResponse(200,user,"Account details updated successfully"))
})

const updateuseravatar = asynchandler(async(req,res)=>{
    const avatarlocalpath = req.file?.path
    if(!avatarlocalpath){
        throw new ApiError(400,"Avatar file is missing")
    }
    const avatar = await uploadoncloudinary(avatarlocalpath)
    if(!avatar.url){
        throw new ApiError(400,"Error while uploading on avatar")
    }
    await User.findByIdAndUpdate(req.user?._id,{$set:{avatar:avatar.url}},{new:true}).select("-password")
})
export { registeruser , loginuser,logoutuser,getcurrentuser,changepassword,updateaccountdetails,updateuseravatar};
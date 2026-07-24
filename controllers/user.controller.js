import { asynchandler } from "../utils/asyncHandler.js";
const registeruser = asynchandler(async(req,res,next)=>{
    res.status(200).json({
        message:"Success"
    })
})
export {registeruser}
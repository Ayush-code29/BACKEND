import { Router } from "express";
import { loginuser, logoutuser, registeruser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyjwt } from "../middlewares/auth.middleware.js";
const userrouter = Router();
userrouter.route("/register").post(
    upload.fields([{name:"avatar",maxCount:1},{name:"coverimage",maxCount:1}]),
    registeruser)
userrouter.route("/login").post(loginuser)
//secured routes
userrouter.route("/logout").post(verifyjwt,logoutuser)
export default userrouter
import { Router } from "express";
import { registeruser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
const userrouter = Router();
userrouter.route("/register").post(
    upload.fields([{name:"avatar",maxCount:1},{name:"coverimage",maxCount:1}]),
    registeruser)
export default userrouter
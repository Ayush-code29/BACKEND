import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiEroor.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asyncHandler.js";
import { uploadoncloudinary } from "../utils/cloudinary.js";

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

    // ===========================
    // LOCAL FILE PATHS
    // ===========================
    const avatarlocalpath = req.files?.avatar?.[0]?.path;
    const coverimagelocalpath = req.files?.coverimage?.[0]?.path;

    console.log("Avatar Local Path:", avatarlocalpath);
    console.log("Cover Local Path:", coverimagelocalpath);

    if (!avatarlocalpath) {
        throw new ApiError(400, "Avatar image is required");
    }

    // ===========================
    // CLOUDINARY UPLOAD
    // ===========================
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

export { registeruser };
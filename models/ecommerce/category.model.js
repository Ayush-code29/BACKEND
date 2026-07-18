import mongoose from "mongoose";
const categoryschema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    }

},{timestamps:true})
export const Category = mongoose.model("Category",categoryschema)
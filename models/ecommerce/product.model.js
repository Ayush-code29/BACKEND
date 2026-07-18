import mongoose from "mongoose";
const orderschema = mongoose.Schema({
    orderprice:{
        type:Number,
        required:true,
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    
},{timestamps:true})
const Order = mongoose.model("Order",orderschema)
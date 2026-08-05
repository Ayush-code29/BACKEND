import mongoose from "mongoose";

const subscriptionschema = new mongoose.Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    chanel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    }
},{timestamps:true})
export const subscription = mongoose.model("Subscription",subscriptionschema)
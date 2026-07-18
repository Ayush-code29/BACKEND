import mongoose, { Mongoose } from "mongoose";
const orderitemschema = new mongoose.Schema({
    productid:{
        type:Mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    quantity:{
        type:Number,
        required:true
    }
})
const orderschema = new mongoose.Schema({
    description:{
        required:true,
        type:String
    },
    name:{
        required:true,
        type:String

    },
    productimage:{
        type:String,
    
    },
    price:{
        type:Number,
        default:0
    },
    stock:{
        type:Number,
        default:0
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true,

    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    orderitems:{
        type:[orderitemschema]
    },
    address:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["PENDING","CANCELLED","DELIEVERED"]
    }
},{timestamps:true})
const Order = mongoose.model("Order",orderschema)
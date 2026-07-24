import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectdb from "./db/index.js";
import { configDotenv } from "dotenv";
import { app } from "./app.js";
configDotenv()
connectdb().then(()=>{
    app.listen(process.env.port || 8000,()=>{
        console.log(`server is running at port : ${process.env.port}`)
    })
}).catch((err)=>{
    console.log("MONGO DB CONNECTION FAILED !!!" , err)
})

import dotenv from "dotenv";
 const result = dotenv.config({
    path: "./.env"
});
console.log("INDEX:", process.env.CLOUDINARY_CLOUD_NAME);
console.log(result)
import connectdb from "./db/index.js";
import { app } from "./app.js";

connectdb()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port ${process.env.PORT || 8000}`);
    });
})
.catch((err) => {
    console.log("MongoDB Connection Failed", err);
});
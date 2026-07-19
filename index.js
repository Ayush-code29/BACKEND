import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectdb from "./db/index.js";
import { configDotenv } from "dotenv";
configDotenv()
connectdb()
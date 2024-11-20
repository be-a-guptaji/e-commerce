import express from "express";
import dotenv from "dotenv"; 
import connectDB from "./utils/connectDB.js";
 
const app = express();
dotenv.config();

connectDB();

app.get("/", (req, res) => {
    res.json({ status: 200, message: "Hello World!" });
}); 

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});  
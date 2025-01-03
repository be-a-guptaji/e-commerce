import mongoose from "mongoose";

//Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }
}

export default connectDB;

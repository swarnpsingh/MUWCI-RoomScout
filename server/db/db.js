import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://swarnpratapsingh5:swarn%40123@roomscout.zlad2.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=roomScout`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB Connected");
    } catch (error) {
        console.log("MONGODB connection error ", error);
        process.exit(1);
    }
}

export default connectDB;

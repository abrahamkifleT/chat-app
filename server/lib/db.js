import mongoose from "mongoose";

// Function to connect to connect the mongodb database

export const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("data base is connected"))

        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app `)
        console.log("MongoDB connected")
    } catch (error) {
        console.log(error);

    }
}
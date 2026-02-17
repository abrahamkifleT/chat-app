import express from "express";
import "dotenv/config"
import cors from "cors"
import http from "http"
import { connectDB } from "./lib/db.js";

const app = express();

const server = http.createServer(app);

// middleware
app.use(cors());
app.use(express.json({limit: "4mb"}));


// route
app.use("/api/status", (req, res)=> res.send("Server is running"))


// Connect to mongodb
await connectDB()


const PORT = process.env.PORT || 5000
server.listen(PORT, ()=> console.log("server is running on PORT: " + PORT))













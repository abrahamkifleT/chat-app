import express from "express";
import "dotenv/config"
import cors from "cors"
import http from "http"
import { connectDB } from "./lib/db.js";
import userRoute from "./routes/userRoutes.js"
import messageRoute from "./routes/messageRoutes.js"
import { Server } from "socket.io"

const app = express();

const server = http.createServer(app);

// Initialize socket.io
export const io = new Server(server, {
    cors: {
        origin: "*",
    }
})

// Store online users
export const userSocketMap = {} //{userId: sockeId}

// socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId
    console.log("Connected", userId)

    if (userId) userSocketMap[userId] = socket.id

    // Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", () => {
        console.log("User Disconnected", userId)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })

})

// middleware
app.use(cors());
app.use(express.json({ limit: "4mb" }));


// route
app.use("/api/status", (req, res) => res.send("Server is running"))
app.use("/api/auth", userRoute)
app.use("/api/messages", messageRoute)

// Connect to mongodb
await connectDB()

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000
    server.listen(PORT, () => console.log("server is running on PORT: " + PORT))
}

// Export server for vercel

export default server;













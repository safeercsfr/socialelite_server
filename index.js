import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./utils/mongodb.js";
import { upload } from './utils/multer.js';
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import messageRoutes from "./routes/messages.js";
import converstationRoutes from "./routes/converstation.js";
import { register } from "./controllers/auth.js";
import { updateProPic } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middlleware/auth.js";
import { createServer } from 'http';
import { Server } from 'socket.io';

// CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000'
    }
});
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// ROUTES WITH FILE
app.post("/auth/register", upload.single("picture"), register);
app.put("/auth/update", verifyToken, upload.single("picture"), updateProPic);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/messages", messageRoutes);
app.use("/converstations", converstationRoutes);

let users = []

const addUser = (urId, socketId) => {
    !users.some(user => user.urId === urId) &&
        users.push({ urId, socketId });
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}

const getUser = (id) => {
    return users.find(user => user.urId === id)
}

io.on('connection', (socket) => {
    console.log('connection');
    // take urId and socketId from user
    socket.on('addUser', urId => {
        console.log('add new connection');
        addUser(urId, socket.id);
        io.emit('getUsers', users)
    })
    // Send and Get message
    socket.on('sendMessage', ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        console.log('new message');
        io.to(user?.socketId).emit('getMessage', {
            senderId, text
        })
    })

    // Disconnect
    socket.on('disconnect', () => {
        console.log('Dissconnected');
        removeUser(socket.id)
        io.emit('getUsers', users)
    })
})


// MONGOOSE SETUP
connectDB();
const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => console.log(`Server Running Port:${PORT}`));
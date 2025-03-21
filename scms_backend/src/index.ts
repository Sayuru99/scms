import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "dotenv";
import rateLimit from "express-rate-limit";
import { Server } from "socket.io";
import { createServer } from "http";
import { AppDataSource } from "./config/database";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/error.middleware";
import userRoutes from "./routes/user.routes";
import permissionRoutes from "./routes/permissions.routes";
import roleRoutes from "./routes/roles.routes";
import resourceRoutes from "./routes/resource.routes";
import courseRoutes from "./routes/courses.routes";
import lecturerRoutes from "./routes/lecturer.routes";
import { ChatService } from "./services/chat.service";
import { ChatController } from "./controllers/chat.controller";
import chatRoutes from "./routes/chat.routes";

config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

app.options("*", cors());

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
  })
);

const chatService = new ChatService(io);
const chatController = new ChatController(chatService);

io.on("connection", (socket) => {
  // console.log(`User connected: ${socket.id}`);
  chatService.setupSocket(socket);
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lecturers", lecturerRoutes);
app.use("/api/chat", chatRoutes(chatController));

app.use(errorHandler);

const PORT = process.env.PORT || 7200;

AppDataSource.initialize()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log("Socket.IO server runnning");
    });
  })
  .catch((error) => console.log("Database connection error:", error));

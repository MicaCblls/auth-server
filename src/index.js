import express from "express";
import dotenv from "dotenv";
import {
  notFoundMiddleware,
  errorHandlerMiddleware,
} from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
dotenv.config();

const port = process.env.PORT || 5000;

connectDB();
const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

server.use("/api/users", userRoutes);
server.use(notFoundMiddleware);
server.use(errorHandlerMiddleware);

server.get("/", (req, res) => res.send("Server ready"));

server.listen(port, () => console.log(`Server listening on port ${port}`));

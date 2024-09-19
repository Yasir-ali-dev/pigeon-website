import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import session from "express-session";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import Clubsroute from "./routes/Clubsroute.js";
import Pigeonownerroute from "./routes/Pigeonownerroute.js";
import tournamentRoute from "./routes/tournamentRoute.js";
import requestTournamentRoutes from "./routes/tournamentRoute.js";
import imageRoutes from "./routes/ImageRoutes.js";
import cors from "cors";
const helmet = require("helmet");
// import { createServer } from "http";
// import { Server } from "socket.io";

const app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer);
dotenv.config();

// Allow multiple origins for CORS
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      "https://sonapunjab.com",
      "https://api.sonapunjab.com",
    ],
    credentials: true,
  })
);
app.use(helmet());
// app.use(
//   session({
//     saveUninitialized: false,
//     secret: process.env.SESSION_SECRET,
//     cookie: {
//       secure: true,
//       httpOnly: true,
//       maxAge: 3600000,
//     },
//   })
// );

app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"));

app.use(express.urlencoded({ extended: false }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/v1/auth", Clubsroute);
app.use("/api/v1", Pigeonownerroute);
app.use("/api/v1/tournaments", tournamentRoute);
app.use("/api/v1/images", imageRoutes);
app.use("/api/v1/requestTournaments", requestTournamentRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Welcome to app</h1>");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running at ${PORT}`.bgGreen.white);
});

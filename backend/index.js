import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from './config/db.js';
import matrixRoutes from './routes/matrixRoutes.js';
import openairoutes from "./routes/OpenAiRoutes.js"
import userRoutes from "./routes/userRoutes.js";
import ChallengeRoutes from "./routes/ChallengeRoutes.js"
import axios from "axios";
import { app, server} from "./config/socket.js"
import messageRoutes from "./routes/MessageRoutes.js"
dotenv.config();
connectDB();

const url = `https://unlok-backend.onrender.com`;
const interval = 30000;

// function reloadWebsite() {
//   axios
//     .get(url)
//     .then((response) => {
//       // console.log("website reloded");
//     })
//     .catch((error) => {
//       console.error(`Error : ${error.message}`);
//     });
// }

// setInterval(reloadWebsite, interval);


// const app = express();
app.use(cors({
  origin: ['http://localhost:5173','http://localhost:5174',"https://unlok-lkr3.onrender.com"], // ✅ allow frontend dev & production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // if you're using cookies/auth headers
}));
app.use(express.json());
app.get("/" ,(req,res)=>{
    res.send("hello buddy")
})

app.use('/api/matrices', matrixRoutes);
app.use('/api/messages', messageRoutes);
app.use("/",openairoutes)
app.use("/api/user", userRoutes);
app.use("/api/challenge", ChallengeRoutes);
const PORT = process.env.PORT || 5000;
server.listen(PORT,'0.0.0.0', () => console.log(`🚀 Server running on http://localhost:${PORT}`));

import express from "express";
import { registerUser, loginUser,findRankingOrder } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get-global-ranking",findRankingOrder)
// todo :make a controler to send the users in ordr of their ranking
export default router;


// routes/userRoutes.js
import express from "express";
import {
  registerUser,
  loginUser,
  findRankingOrder,
  fetchNotifications,
  AddToFriendList,
  FindUsers,
  acceptFriendRequest,
  rejectFriendRequest,ChallengeSync
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get-global-ranking", findRankingOrder);
router.post("/FindFriend", FindUsers);
router.post("/addFriendRequest", AddToFriendList);
router.post("/acceptRequest", acceptFriendRequest);
router.post("/rejectRequest", rejectFriendRequest); // ✅ new
router.post("/fetchNotification", fetchNotifications);
router.post("/challenge/sync", ChallengeSync);

export default router;

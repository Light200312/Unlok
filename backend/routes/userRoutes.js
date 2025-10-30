import express from "express";
import {
  registerUser,
  loginUser,
  findRankingOrder,
  fetchNotifications,
  AddToFriendList,
  FindUsers,
  acceptFriendRequest,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get-global-ranking", findRankingOrder);
router.post("/FindFriend", FindUsers);
router.post("/addFriendRequest", AddToFriendList);
router.post("/acceptRequest", acceptFriendRequest);
router.post("/fetchNotification", fetchNotifications);

export default router;

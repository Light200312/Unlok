import express from "express";
import { registerUser, loginUser,findRankingOrder,fetchNotifications ,AddToFriendList,FindUsers,acceptFriendRequest} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get-global-ranking",findRankingOrder)

//! send friendId and userId in body by post
router.post("/addFriendRequest",AddToFriendList)
//! send  neededUsername, neededUserID in body
router.post("/FindFriend",FindUsers)
// todo :route for accepting friend request,{ userId, notificationId } 
router.post("/acceptRequest",acceptFriendRequest)

router.post("/fetchNotification",fetchNotifications)
export default router;


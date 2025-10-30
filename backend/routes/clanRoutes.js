import express from "express";
import {
  createClan,
  inviteToClan,
  acceptClanInvite,
  leaveClan,
  kickClanMember,
  updateClanRole,
  getClanMessages,
  sendClanMessage,
  // 🆕 Newly added
  searchClans,
  getClanInfo,
  requestJoinClan,
} from "../controllers/clanController.js";

const router = express.Router();

/* 🏰 Clan Management */
router.post("/create", createClan);
router.post("/invite", inviteToClan);
router.post("/accept", acceptClanInvite);
router.post("/leave", leaveClan);
router.post("/kick", kickClanMember);
router.post("/updateRole", updateClanRole);

/* 🧭 Clan Discovery */
router.post("/search", searchClans);
router.get("/info/:clanId", getClanInfo);
router.post("/requestJoin", requestJoinClan);

/* 💬 Clan Chat */
router.get("/chat/:clanId", getClanMessages);
router.post("/chat/:clanId", sendClanMessage);

export default router;

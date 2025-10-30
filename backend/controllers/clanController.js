import Clan from "../models/Clan.js";
import User from "../models/User.js";
import Message from "../models/message.model.js";
import { v4 as uuidv4 } from "uuid";
import { io } from "../config/socket.js";

/** 🏰 Create a Clan */
export const createClan = async (req, res) => {
  try {
    const { name, description, bannerImage, leaderId } = req.body;
    const leader = await User.findById(leaderId);
    if (!leader) return res.status(404).json({ error: "Leader not found" });

    // Ensure leader not already in a clan
    if (leader.clan)
      return res.status(400).json({ error: "User already belongs to a clan" });

    const clan = await Clan.create({
      name,
      description,
      bannerImage,
      leader: leader._id,
      members: [leader._id],
      chatRoomId: uuidv4(),
    });

    // Update leader’s profile
    leader.clan = clan._id;
    leader.clanRole = "leader";
    await leader.save();

    res.status(201).json({ message: "Clan created successfully", clan });
  } catch (err) {
    console.error("Error creating clan:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/** 📩 Invite a user to a Clan */
export const inviteToClan = async (req, res) => {
  try {
    const { clanId, senderId, targetUserId } = req.body;

    const clan = await Clan.findById(clanId);
    const sender = await User.findById(senderId);
    const target = await User.findById(targetUserId);

    if (!clan || !sender || !target)
      return res.status(404).json({ error: "Invalid clan or user" });

    if (!["leader", "co-leader"].includes(sender.clanRole))
      return res.status(403).json({ error: "No permission to invite users" });

    if (target.clan)
      return res.status(400).json({ error: "User already in another clan" });

    // Create notification
    const notifId = uuidv4();
    target.requestsNotifications.push({
      notificationId: notifId,
      userId: sender._id,
      username: sender.username,
      rank: sender.rank,
      requestRegarding: "Clan Join Request",
      isAccepted: false,
      notificationType: "received",
    });

    await target.save();

    res.status(200).json({ message: "Clan invite sent successfully" });
  } catch (err) {
    console.error("Error inviting user:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/** ✅ Accept Clan Invite */
export const acceptClanInvite = async (req, res) => {
  try {
    const { userId, clanId, notificationId } = req.body;

    const user = await User.findById(userId);
    const clan = await Clan.findById(clanId);
    if (!user || !clan) return res.status(404).json({ error: "User or clan not found" });

    // Remove the join request notification
    user.requestsNotifications = user.requestsNotifications.filter(
      (n) => n.notificationId !== notificationId
    );

    // Add to clan
    user.clan = clan._id;
    user.clanRole = "member";
    await user.save();

    clan.members.push(user._id);
    await clan.save();

    // 🟢 Send system join message
    const joinMsg = await Message.create({
      senderId: user._id,
      room: clan.chatRoomId,
      text: `🎉 ${user.username} has joined the clan.`,
      system: true,
    });

    io.to(clan.chatRoomId).emit("newClanMessage", joinMsg);

    res.status(200).json({ message: "Joined clan successfully", clan });
  } catch (err) {
    console.error("Error accepting clan invite:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * 🚪 Leave Clan — user voluntarily leaves clan
 * Sends system message: “User has left the clan.”
 */
export const leaveClan = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user || !user.clan)
      return res.status(400).json({ error: "User is not in any clan" });

    const clan = await Clan.findById(user.clan);
    if (!clan) return res.status(404).json({ error: "Clan not found" });

    // Remove user from clan member lists
    clan.members = clan.members.filter((m) => m.toString() !== userId);
    clan.coLeaders = clan.coLeaders.filter((m) => m.toString() !== userId);
    await clan.save();

    // Reset user clan data
    user.clan = null;
    user.clanRole = "none";
    await user.save();

    // 🟡 Send system leave message
    const leaveMsg = await Message.create({
      senderId: user._id,
      room: clan.chatRoomId,
      text: `👋 ${user.username} has left the clan.`,
      system: true,
    });

    io.to(clan.chatRoomId).emit("newClanMessage", leaveMsg);

    res.status(200).json({ message: "User left the clan successfully" });
  } catch (err) {
    console.error("Error leaving clan:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/** 🦶 Kick a member */
/** 🚫 Kick a clan member (with system message) */
export const kickClanMember = async (req, res) => {
  try {
    const { clanId, memberId, adminId } = req.body;

    const clan = await Clan.findById(clanId);
    const admin = await User.findById(adminId);
    const member = await User.findById(memberId);

    if (!clan || !admin || !member)
      return res.status(404).json({ error: "Not found" });

    if (!["leader", "co-leader"].includes(admin.clanRole))
      return res.status(403).json({ error: "No permission" });

    // Remove from members & coLeaders
    clan.members = clan.members.filter((m) => m.toString() !== memberId);
    clan.coLeaders = clan.coLeaders.filter((m) => m.toString() !== memberId);
    await clan.save();

    // Update user record
    member.clan = null;
    member.clanRole = "none";
    await member.save();

    // 🟠 System message: kicked
    const kickMsg = await Message.create({
      senderId: admin._id,
      room: clan.chatRoomId,
      text: `⚔️ ${member.username} was kicked from the clan by ${admin.username}.`,
      system: true,
    });

    io.to(clan.chatRoomId).emit("newClanMessage", kickMsg);

    res.status(200).json({ message: "Member kicked successfully" });
  } catch (err) {
    console.error("Error kicking member:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/** ⚙️ Promote or demote a member (with system message) */
export const updateClanRole = async (req, res) => {
  try {
    const { clanId, adminId, memberId, newRole } = req.body;

    const clan = await Clan.findById(clanId);
    const admin = await User.findById(adminId);
    const member = await User.findById(memberId);

    if (!clan || !admin || !member)
      return res.status(404).json({ error: "Not found" });

    if (admin.clanRole !== "leader")
      return res.status(403).json({ error: "Only leader can promote/demote" });

    // Update user role
    member.clanRole = newRole;
    await member.save();

    // Update clan lists
    if (newRole === "co-leader" && !clan.coLeaders.includes(member._id)) {
      clan.coLeaders.push(member._id);
    } else if (newRole === "member") {
      clan.coLeaders = clan.coLeaders.filter((id) => id.toString() !== memberId);
    }
    await clan.save();

    // 🟢 System message: role change
    const roleAction =
      newRole === "co-leader"
        ? `⬆️ ${member.username} has been promoted to Co-Leader by ${admin.username}.`
        : `⬇️ ${member.username} has been demoted to Member by ${admin.username}.`;

    const roleMsg = await Message.create({
      senderId: admin._id,
      room: clan.chatRoomId,
      text: roleAction,
      system: true,
    });

    io.to(clan.chatRoomId).emit("newClanMessage", roleMsg);

    res.status(200).json({ message: `Updated ${member.username} to ${newRole}` });
  } catch (err) {
    console.error("Error updating role:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/** 💬 Fetch Clan Chat */
export const getClanMessages = async (req, res) => {
  try {
    const { clanId } = req.params;
    const messages = await Message.find({ clanId })
      .sort({ createdAt: 1 })
      .populate("senderId", "username profilePic");
    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching clan messages:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/** 📤 Send Clan Message */
export const sendClanMessage = async (req, res) => {
  try {
    const { clanId } = req.params;
    const { userId, text, image } = req.body;

    const msg = await Message.create({ senderId: userId, clanId, text, image });
    const populated = await msg.populate("senderId", "username profilePic");

    io.to(clanId.toString()).emit("newClanMessage", populated);
    res.status(201).json(populated);
  } catch (err) {
    console.error("Error sending clan message:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
/** 🔍 Search Clans by name or ID */
export const searchClans = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Search query required" });

    const clans = await Clan.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { _id: query }
      ],
    })
      .populate("leader", "username rank profilePic")
      .populate("coLeaders", "username rank profilePic")
      .populate("members", "username rank profilePic");

    res.status(200).json(clans);
  } catch (err) {
    console.error("Error searching clans:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/** 🧭 Get full clan info by ID */
export const getClanInfo = async (req, res) => {
  try {
    const { clanId } = req.params;
    const clan = await Clan.findById(clanId)
      .populate("leader", "username rank profilePic")
      .populate("coLeaders", "username rank profilePic")
      .populate("members", "username rank profilePic");

    if (!clan) return res.status(404).json({ error: "Clan not found" });

    res.status(200).json(clan);
  } catch (err) {
    console.error("Error getting clan info:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/** 🙋‍♂️ Request to join a clan */
export const requestJoinClan = async (req, res) => {
  try {
    const { clanId, userId } = req.body;

    const clan = await Clan.findById(clanId);
    const user = await User.findById(userId);
    if (!clan || !user)
      return res.status(404).json({ error: "Clan or user not found" });

    if (user.clan)
      return res.status(400).json({ error: "You are already in a clan" });

    // Avoid duplicates
    if (clan.joinRequests.includes(userId))
      return res.status(400).json({ error: "Already requested" });

    clan.joinRequests.push(userId);
    await clan.save();

    // Optional: send notification to leader
    const notifId = uuidv4();
    const leader = await User.findById(clan.leader);
    if (leader) {
      leader.requestsNotifications.push({
        notificationId: notifId,
        userId: user._id,
        username: user.username,
        requestRegarding: `Join request for clan ${clan.name}`,
        notificationType: "received",
      });
      await leader.save();
    }

    res.status(200).json({ message: "Join request sent successfully" });
  } catch (err) {
    console.error("Error requesting to join clan:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

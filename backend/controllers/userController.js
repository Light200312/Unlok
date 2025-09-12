import User from "../models/User.js";
import { createMatricesFromAI,createMatrices ,creategeneralstats} from "./matrixController.js"; // Must handle DB creation and AI prompt
import Matrix from "../models/Matrix.js";
import {v4 as uuidv4} from "uuid"

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ error: "User already exists" });

    // Create and save user
    user = new User({ username, email, password });
    await user.save();

    // ✅ Generate and save default "general" matrices linked to the user
   const matrices = {
  "Cognitive Growth": [
    "Focus",
    "Problem Solving",
    "Critical Thinking",
    "Learning Speed",
    "Memory"
  ],
  "Physical Wellness": [
    "Strength",
    "Stamina",
    "Sleep",
    "Health Score"
  ],
  "Emotional Intelligence": [
    "Self-Awareness",
    "Impulse Control",
    "Empathy",
    "Stress Management"
  ],
  "Social Character": [
    "Communication",
    "Listening",
    "Leadership",
    "Conflict Resolution",
    "Integrity"
  ],
  "Discipline & Productivity": [
    "Task Completion",
    "Time Management",
    "Habit Streaks",
    "Goal Consistency",
    "Motivation"
  ],
  "Growth Mindset": [
    "Feedback Openness",
    "Learning Activity",
    "Resilience",
    "Mentorship"
  ],
  "Purpose & Values": [
    "Goal Clarity",
    "Value Alignment",
    "Contribution",
    "Self-Reflection"
  ]
};

    const stats=await creategeneralstats({
  body: {
    userId: user._id,
    matrices: matrices
  }
});
 // You implement this in matrixController
console.log( "Registered successfully")
    res.status(201).json({ message: "Registered successfully", _id: user._id , username:user.username,stats});
  } catch (err) {
    console.error("❌ Register Error:", err.message);
    res.status(500).json({ error: "Failed to register user" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Login success", _id:user._id, username:user.username,rank:user.rank,titles:user.titles,badges:user.badges,points:user.points});
    console.log("Login Success")
  } catch (err) {
    console.error("❌ Login Error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
};


const rankTiers = [
  { points: 700, code: "S1", title: "Devine" },
  { points: 500, code: "A2", title: "Spirit" },
  { points: 350, code: "B3", title: "Sovereign" },
  { points: 200, code: "C4", title: "Saint" },
  { points: 100, code: "D5", title: "Master" },
  { points: 50,  code: "E6", title: "Awakened" },
  { points: 0,   code: "F7", title: "Sleeper" },
];





const getRankInfo = (points) => {
  return rankTiers.find((tier) => points >= tier.points) || rankTiers.at(-1);
};



export const findRankingOrder = async (req, res) => {
  try {
    const users = await User.find({}, "_id username");

    const updatedUsers = await Promise.all(
      users.map(async (user) => {
        const matrices = await Matrix.find({ userId: user._id, type: "general" });

        const totalPoints = matrices.reduce(
          (sum, m) => sum + m.metrics.reduce((s, x) => s + x.value, 0),
          0
        );

        const rank = getRankInfo(totalPoints);

        await User.findByIdAndUpdate(user._id, {
          points: totalPoints,
          rank: rank.code,
          $addToSet: { titles: rank.title },
        });

        return {
          _id: user._id,
          username: user.username,
          totalPoints,
          rankCode: rank.code,
          rankTitle: rank.title,
        };
      })
    );

    // Sort and select top 20
    const rankedUsers = updatedUsers
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 20)
      .map((user, index) => ({
        rank: index + 1,
        username: user.username,
        points: user.totalPoints,
        rankCode: user.rankCode,
        rankTitle: user.rankTitle,
      }));

    res.json({ success: true, users: rankedUsers });
  } catch (err) {
    console.error("❌ Error finding ranking order:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch rankings." });
  }
};


//a controler to find user:sending user name/id in body


// Find a user by username or ID
export const FindUsers = async (req, res) => {
  const { neededUsername, neededUserID } = req.body;

  try {
    // (Optional) Validate requesting user exists
    if (req.body.userId) {
      const requestingUser = await User.findById(req.body.userId)
      if (!requestingUser) {
        return res.status(404).json({ error: "Requesting user not found" });
      }
    }

    let foundUsers = [];

    if (neededUserID) {
      const user = await User.findById(neededUserID).select("username _id rank points profilePic email");
      if (!user) {
        return res.status(404).json({ error: "User not found by ID" });
      }
      foundUsers = [user]; // wrap in array
    } else if (neededUsername) {
      foundUsers = await User.find({ username: neededUsername }).select("username _id rank points profilePic email");
      if (!foundUsers || foundUsers.length === 0) {
        return res.status(404).json({ error: "No users found with this username" });
      }
    } else {
      return res.status(400).json({ error: "Please provide either neededUserID or neededUsername" });
    }

    res.status(200).json(foundUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while finding user" });
  }
};

// Add a user to friend list (send friend request)
export const AddToFriendList = async (req, res) => {
  const { friendId, userId } = req.body;

  try {
    // Find both users
    const userToAdd = await User.findById(friendId);
    const user = await User.findById(userId);

    if (!userToAdd) {
      return res.status(404).json({ error: "Friend user does not exist" });
    }
    if (!user) {
      return res.status(404).json({ error: "Requesting user not found" });
    }

    // Check if already in friendList
    const alreadyFriend = user.friendList.some(
      (f) => f.userId.toString() === friendId
    );
    if (alreadyFriend) {
      return res.status(400).json({ error: "User already in friend list" });
    }

    // Check if a friend request is already pending
    const alreadyRequested = userToAdd.requestsNotifications.some(
      (n) => n.userId.toString() === userId && n.requestRegarding === "friendRequest" && n.notificationType === "received"
    );
    if (alreadyRequested) {
      return res.status(400).json({ error: "Friend request already sent" });
    }

    // Generate unique notification IDs
    const receivedNotificationId = uuidv4();
    const sentNotificationId = uuidv4();

    // Add friend request notification to the recipient (userToAdd)
    userToAdd.requestsNotifications.push({
      notificationId: receivedNotificationId,
      userId: user._id,
      username: user.username,
      rank: user.rank || "Unranked",
      requestRegarding: "friendRequest",
      isAccepted: false,
      notificationType: "received",
    });

    // Add sent notification to the sender (user)
    user.requestsNotifications.push({
      notificationId: sentNotificationId,
      userId: userToAdd._id,
      username: userToAdd.username,
      rank: userToAdd.rank || "Unranked",
      requestRegarding: "friendRequest",
      isAccepted: false,
      notificationType: "sent",
    });

    // Save both users
    await userToAdd.save();
    await user.save();

    res.status(200).json({
      message: "Friend request sent successfully",
      receivedNotifications: userToAdd.requestsNotifications,
      sentNotifications: user.requestsNotifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while adding friend" });
  }
};

// Accept a friend request
export const acceptFriendRequest = async (req, res) => {
  const { userId, notificationId } = req.body;

  try {
    // Find the user receiving the request
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the notification (received)
    const notification = user.requestsNotifications.find(
      (n) => n.notificationId === notificationId && n.requestRegarding === "friendRequest" && n.notificationType === "received"
    );
    if (!notification) {
      return res.status(404).json({ error: "Friend request notification not found" });
    }

    // Find the friend (the user who sent the request)
    const friend = await User.findById(notification.userId);
    if (!friend) {
      return res.status(404).json({ error: "Friend user not found" });
    }

    // Check if already friends
    const alreadyFriend = user.friendList.some(
      (f) => f.userId.toString() === notification.userId.toString()
    );
    if (alreadyFriend) {
      return res.status(400).json({ error: "User already in friend list" });
    }

    // Add each user to the other's friendList
    user.friendList.push({
      userId: friend._id,
      username: friend.username,
      rank: friend.rank || "Unranked",
    });

    friend.friendList.push({
      userId: user._id,
      username: user.username,
      rank: user.rank || "Unranked",
    });

    // Mark the received notification as accepted and remove it
    notification.isAccepted = true;
    user.requestsNotifications = user.requestsNotifications.filter(
      (n) => n.notificationId !== notificationId
    );

    // Find and mark the corresponding sent notification as accepted and remove it
    const sentNotification = friend.requestsNotifications.find(
      (n) => n.userId.toString() === userId && n.requestRegarding === "friendRequest" && n.notificationType === "sent"
    );
    if (sentNotification) {
      sentNotification.isAccepted = true;
      friend.requestsNotifications = friend.requestsNotifications.filter(
        (n) => n.notificationId !== sentNotification.notificationId
      );
    }

    // Save both users
    await user.save();
    await friend.save();

    res.status(200).json({
      message: "Friend request accepted successfully",
      friendList: user.friendList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while accepting friend request" });
  }
};

// Fetch all notifications for a user
export const fetchNotifications = async (req, res) => {
  const { userId } = req.body;

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get all notifications
    const allNotifications = user.requestsNotifications;

    // Check if notifications array is empty
    if (allNotifications.length === 0) {
      return res.status(200).json({ message: "No notifications available", notifications: [] });
    }

    res.status(200).json({
    
      notifications: allNotifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error while fetching notifications" });
  }
};
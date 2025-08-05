import User from "../models/User.js";
import { createMatricesFromAI,createMatrices ,creategeneralstats} from "./matrixController.js"; // Must handle DB creation and AI prompt
import Matrix from "../models/Matrix.js";
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


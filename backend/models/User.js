import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {

    username: { type: String, required: true, unique: true },
    email: { type: String },
    communityPoints: { type: Number, default: 0 },
verifiedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
clan: { type: mongoose.Schema.Types.ObjectId, ref: "Clan", default: null },
clanRole: { type: String, enum: ["leader", "co-leader", "member", "none"], default: "none" },


    password: { type: String, required: true },
    profilePic: {
      type: String,
      default: "",
    },
    matrices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Matrix" }],
    friendList: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        username: { type: String, required: true },
        rank: { type: String },
      },
    ],
     requestsNotifications: [
      {
        notificationId:{type:String},
        notificationType:{type:String,enum:["received","sent"],required:true},
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        username: { type: String, required: true },
        rank: { type: String },
        requestRegarding: { type: String },
        isAccepted:{type:Boolean}
      },
    ],
    //user rank and titles
    rank: { type: String },
    points: { type: String },
    titles: [{ type: String }],
    badges: [{ type: String }],
  },
  { timestamps: true }
);

// Hash before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Check password match
userSchema.methods.matchPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;

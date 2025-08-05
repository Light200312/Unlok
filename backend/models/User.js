import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, required: true },
  matrices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Matrix' }],
  //user rank and titles
  rank:{type:String},
  points:{type:String},
  titles:[{type:String}],
  badges:[{type:String}]
}, { timestamps: true });

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

const User = mongoose.model('User', userSchema);
export default User;

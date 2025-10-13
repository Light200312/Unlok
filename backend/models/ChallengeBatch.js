import mongoose from 'mongoose';

// Subschema for individual challenge inside a batch
const resourceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['video', 'podcast', 'article', 'book', 'task', 'reflection'],
    required: true,
  },
  name: { type: String, required: true },
  url: { type: String },
});

const singleChallengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  metricCategory: { type: String, required: true },
  subMetric: { type: String, required: true },
  resource: resourceSchema,
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
});

// Parent schema for grouped challenges
const challengeBatchSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Challenge type — one batch per type per user
    type: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      required: true,
    },

    challenges: [singleChallengeSchema], // 7 challenges per batch

    // Scoring & tracking
    totalValue: { type: Number, default: 1, min: 1}, // sum of all 7 (optional)
    completedCount: { type: Number, default: 0 },
    progress: { type: Number, default: 0 }, // 0–100%
    eligibleForPoints: { type: Boolean, default: false },

    // Expiry and timestamps
    expiresAt: { type: Date, index: { expires: 0 } },
  },
  { timestamps: true }
);

// --- Auto-calculate progress before save ---
challengeBatchSchema.pre('save', function (next) {
  if (this.challenges?.length > 0) {
    const completed = this.challenges.filter(c => c.completed).length;
    this.completedCount = completed;
    this.progress = Math.round((completed / this.challenges.length) * 100);
    this.eligibleForPoints = completed >= 4;
    this.totalValue = this.challenges.length * 5; // optional aggregate logic
  }
  next();
});

// Prevent duplicate batch creation for same user & type
challengeBatchSchema.index({ userId: 1, type: 1 }, { unique: true });

const ChallengeBatch = mongoose.model('ChallengeBatch', challengeBatchSchema);
export default ChallengeBatch;

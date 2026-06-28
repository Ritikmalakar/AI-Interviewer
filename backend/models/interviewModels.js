import mongoose from "mongoose";

const quesSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },

  difficulty: {
    type: String,
    default: "Medium",
  },

  timeLimit: {
    type: Number,
    default: 120,
  },

  answer: {
    type: String,
    default: "",
  },

  feedback: {
    type: String,
    default: "",
  },

  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },

  confidence: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },

  communication: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },

  correctness: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },

  confidenceRemark: {
    type: String,
    default: "",
  },

  communicationRemark: {
    type: String,
    default: "",
  },

  correctnessRemark: {
    type: String,
    default: "",
  },
});

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: String,
      required: true,
      trim: true,
    },

    mode: {
      type: String,
      enum: ["HR", "Technical"],
      required: true,
    },

    resume: {
      type: String,
      default: "",
    },

    questions: {
      type: [quesSchema],
      default: [],
    },

    finalScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: ["Incomplete", "Complete"],
      default: "Incomplete",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Interview", interviewSchema);
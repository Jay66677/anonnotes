// server/models/Report.js
import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    note: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AnonNote",
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      select: false, // only admin may reveal identity
    },
    reason: {
      type: String,
      default: "hateful or abusive content",
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "action_taken"],
      default: "pending",
    }
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;

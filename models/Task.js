const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    title: { type: String, required: true },
    description: { type: String },
    category: {
      type: String,
      enum: ["Unassigned", "In Development", "Pending Review", "Done"],
      default: "Unassigned",
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    deadline: { type: Date },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const boardSchema = new Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    googleId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String },
    recentlyVisitedBoards: [{ type: Schema.Types.ObjectId, ref: "Board" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

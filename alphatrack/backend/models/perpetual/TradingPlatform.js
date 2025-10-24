import mongoose from "mongoose";

const PlatformSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ["CEX", "DEX", "BROKER"],
    required: true,
  },
});

const Platform = mongoose.model("Platform", PlatformSchema);

export default Platform;
import mongoose from "mongoose";

const PerpetualTradeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pair: { type: String, required: true }, 
    positionType: { type: String, enum: ["LONG", "SHORT"], required: true },
    platform: {type: String, required: true },
    // platform: { type: mongoose.Schema.Types.ObjectId, ref: "Platform" },
    entryPrice: { type: Number, required: true },
    exitPrice: { type: Number },
    leverage: { type: Number },
    openDate: { type: Date, required: true },
    closeDate: { type: Date },
    pnl: { type: Number }, 
    duration: { type: Number }, 
    notes: { type: String },
  },
  { timestamps: true }
);

const PerpetualTrade = mongoose.model("PerpetualTrade", PerpetualTradeSchema);

export default PerpetualTrade;
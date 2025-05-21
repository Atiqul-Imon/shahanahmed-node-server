import mongoose from "mongoose";

const snippetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, required: true },
  language: { type: String, enum: ["Python", "SQL", "R", "Markdown"], required: true },
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Snippet", snippetSchema);

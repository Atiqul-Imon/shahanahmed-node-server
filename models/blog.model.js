import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    bodyImages: [
      {
        url: String,
        public_id: String,
      },
    ],
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    categories: {
      type: [String],
      enum: ["Podcast", "Interviews", "Blog"],
      default: [],
    },
    publishDate: Date,
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;

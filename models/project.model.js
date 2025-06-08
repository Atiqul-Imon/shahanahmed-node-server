import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    image: {
    url: String,
    public_id: String,
  },
    
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
    
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
   
    publishDate: Date,
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;

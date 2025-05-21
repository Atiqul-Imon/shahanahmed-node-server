import Blog from "../models/blog.model.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const createBlog = async (req, res) => {
  try {
    const { title, description, categories = [], status = "draft" } = req.body;
    const image = req.file;
    const author = req.userId;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    let imageUrl = "";

    if (image) {
      const base64Image = Buffer.from(image.buffer).toString("base64");
      const dataURI = `data:${image.mimetype};base64,${base64Image}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "blog",
      });
      imageUrl = result.secure_url;
    }

    const newBlog = new Blog({
      title,
      description,
      categories,
      status,
      image: imageUrl,
      author,
    });

    await newBlog.save();

    return res.status(201).json({
      message: "Blog created successfully",
      blog: newBlog,
      success: true,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};



export const getAllBlogs = async (req, res) => {
  try {
    const { status, categories, page = 1, limit = 10, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (categories) query.categories = { $in: categories.split(',') };
    if (search) query.title = { $regex: search, $options: 'i' };

    const blogs = await Blog.find(query)
      .populate('author', 'name email')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Blog.countDocuments(query);

    return res.json({
      success: true,
      data: blogs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email');

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    return res.json({ success: true, data: blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
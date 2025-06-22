import Project from "../models/project.model.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const createProject = async (req, res) => {
  try {
    const { title, description, status = "draft", technologies, liveUrl, sourceUrl } = req.body;
    const files = req.files;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    let imagesData = [];

    if (files && files.length > 0) {
      // Filter for files from the 'images' field
      const imageFiles = files.filter(file => file.fieldname === 'images');

      const uploadPromises = imageFiles.map(file => {
        const base64Image = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${file.mimetype};base64,${base64Image}`;
        return cloudinary.uploader.upload(dataURI, {
          folder: "project",
        });
      });

      const results = await Promise.all(uploadPromises);
      
      imagesData = results.map(result => ({
        url: result.secure_url,
        public_id: result.public_id
      }));
    }

    const newProject = new Project({
      title,
      description,
      status,
      images: imagesData,
      technologies: technologies ? technologies.split(',').map(item => item.trim()) : [],
      liveUrl,
      sourceUrl
    });

    await newProject.save();

    return res.status(201).json({
      message: "Project created successfully",
      project: newProject,
      success: true,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
    });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) query.title = { $regex: search, $options: 'i' };

    const projects = await Project.find(query)
    
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(query);

    return res.json({
      success: true,
      data: projects,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
 

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    return res.json({ success: true, data: project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Delete all images associated with the project from Cloudinary
    if (project.images && project.images.length > 0) {
      const deletePromises = project.images.map(img => cloudinary.uploader.destroy(img.public_id));
      await Promise.all(deletePromises);
    }

    await Project.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, technologies, liveUrl, sourceUrl, status } = req.body;
    const files = req.files;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Prepare update data
    const updateData = { title, description, liveUrl, sourceUrl, status };
    if (technologies) {
      updateData.technologies = technologies.split(',').map(item => item.trim());
    }

    // Handle image update if new images are provided
    if (files && files.length > 0) {
       const uploadPromises = files.map(file => {
        const base64Image = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${file.mimetype};base64,${base64Image}`;
        return cloudinary.uploader.upload(dataURI, {
          folder: "project",
        });
      });

      const results = await Promise.all(uploadPromises);
      
      const newImagesData = results.map(result => ({
        url: result.secure_url,
        public_id: result.public_id
      }));
      
      updateData.images = [...project.images, ...newImagesData];
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.json({
      success: true,
      project: updatedProject,
      message: "Project updated successfully"
    });
  } catch (error) {
    console.error("Error updating project:", error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
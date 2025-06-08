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
    const { title, description, status = "draft" } = req.body;
    const featuredImage = req.file;



    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    let imageData = {};

    if (featuredImage) {
      const base64Image = Buffer.from(featuredImage.buffer).toString("base64");
      const dataURI = `data:${featuredImage.mimetype};base64,${base64Image}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "project",
      });
      

      imageData = {
        url: result.secure_url,
        public_id: result.public_id
      };
    }

   

    const newProject = new Project({
      title,
      description,
      status,
      image: imageData,
      
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
      message: "Internal server error",
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

  
  if (project.image?.public_id) {
  await cloudinary.uploader.destroy(project.image.public_id);
}
    
    if (project.bodyImages?.length) {
      for (const img of project.bodyImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }
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
    const { title, description, status } = req.body;
    const image = req.file;
    const updateData = { title, description, status };
    const bodyImagesFiles = req.files?.bodyImages || [];


    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (image) {
    
      const base64Image = Buffer.from(image.buffer).toString("base64");
      const dataURI = `data:${image.mimetype};base64,${base64Image}`;
      const result = await cloudinary.uploader.upload(dataURI, { folder: "project" });

    
      if (project.image?.public_id) {
        await cloudinary.uploader.destroy(project.image.public_id);
      }

      updateData.image = {
        url: result.secure_url,
        public_id: result.public_id
      };
    }

    let newBodyImagesData = [];
    for (const file of bodyImagesFiles) {
      const base64Image = Buffer.from(file.buffer).toString("base64");
      const dataURI = `data:${file.mimetype};base64,${base64Image}`;
      const result = await cloudinary.uploader.upload(dataURI, { folder: "project/body" });
      
      newBodyImagesData.push({
        url: result.secure_url,
        public_id: result.public_id
      });
    }

     const existingBodyImages = project.bodyImages || [];
    const updatedBodyImages = [...existingBodyImages, ...newBodyImagesData];

    updateData.bodyImages = updatedBodyImages;

    const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    })

    return res.json({ success: true, project: updatedProject });
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

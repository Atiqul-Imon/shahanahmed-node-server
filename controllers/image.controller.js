import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadEditorImage = async (req, res) => {
  try {
    const image = req.file;

    if (!image) {
      return res.status(400).json({ message: "No image file provided." });
    }

    const base64Image = Buffer.from(image.buffer).toString("base64");
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "editor_images",
    });

    return res.status(200).json({
      success: true,
      url: result.secure_url,
    });
    
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({
      message: "Internal server error during image upload.",
      success: false,
    });
  }
}; 
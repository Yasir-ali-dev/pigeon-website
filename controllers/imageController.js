import Image from "../models/ImageModel.js";
import path from "path";
import crypto from "crypto";
import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Image Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${crypto.randomBytes(16).toString("hex")}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// middleware for handling file upload
export const uploadImage = upload.single("image");

// Add Image
export const addImage = async (req, res) => {
  try {
    const image = await Image({
      imageUrl: req.file ? req.file.filename : null,
    });
    await image.save();
    res.status(201).json({ message: "Image Added Successfully", image });
  } catch (error) {
    res.status(500).json({ message: "Failed to add image", error });
  }
};

// Get All Images
export const getImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ index: 1 });
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch images", error });
  }
};

// Delete Image
export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    // // find the image in the database
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Construct the path to the image file

    const filePath = path.join(__dirname, "../uploads", image.imageUrl);
    console.log("filePath", filePath);

    // remove the image file from the filesystem
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.log("err", err);
        return res
          .status(500)
          .json({ message: "Failed to delete image from filesystem" });
      }

      // // remove the image document from the database
      try {
        await Image.findByIdAndDelete(id);
        res.status(200).json({ message: "Image Delete successfully" });
      } catch (error) {
        return res
          .status(500)
          .json({ message: "failed to delete the image from database" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

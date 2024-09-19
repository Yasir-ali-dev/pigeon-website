import express from "express";
import { isadmin, requiresingnin } from "../middlewares/Authmiddleware.js";
import {
  addImage,
  deleteImage,
  getImages,
  uploadImage,
} from "../controllers/imageController.js";
const router = express.Router();
import Image from "../models/ImageModel.js";
router
  .route("/")
  .post(requiresingnin, isadmin, uploadImage, addImage)
  .get(getImages);

router.delete("/:id", requiresingnin, isadmin, deleteImage);

router.route("/update-order", async (req, res) => {
  const { images } = req.body; // Get updated image data from request body
  try {
    // Loop through the updated images and update the index in the database
    console.log(images);

    for (const image of images) {
      await Image.findByIdAndUpdate(image._id, { index: image.index });
    }
    res.status(200).json({ message: "Image order updated successfully" });
  } catch (error) {
    console.error("Error updating image order:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

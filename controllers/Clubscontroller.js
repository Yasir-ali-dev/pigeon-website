import slugify from "slugify";

import Clubsmodal from "../models/Clubsmodal.js";
import { comparepassword, hashpassword } from "../helpers/Clubshelper.js";
import jsonwebtoken from "jsonwebtoken";

export const registercontroller = async (req, res) => {
  try {
    const { name, cname, email, password } = req.body;

    if (!name || !cname || !email || !password) {
      return res.status(400).json({
        message: "name, club_name, email and password are required fields!",
      });
    }
    // Check if the user already exists
    const existingUser = await Clubsmodal.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Email is already registered",
      });
    }

    // Generate a unique slug
    let slug = slugify(cname, { lower: true });
    let slugExists = await Clubsmodal.findOne({ slug });
    let count = 1;

    while (slugExists) {
      slug = slugify(`${cname}-${count}`, { lower: true });
      slugExists = await Clubsmodal.findOne({ slug });
      count++;
    }
    // Register the user
    const hashedPassword = await hashpassword(password);
    const user = await new Clubsmodal({
      name,
      cname,
      slug,
      email,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "Club created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating club",
      error,
    });
  }
};

export const getAllClubsController = async (req, res) => {
  try {
    const clubs = await Clubsmodal.find({});
    res.status(200).send({
      success: true,
      message: "Clubs fetched successfully",
      clubs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching clubs",
      error,
    });
  }
};

// ==================update=========

export const updateClubController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cname, email } = req.body;

    const club = await Clubsmodal.findById(id);
    if (!club) {
      return res.status(404).send({
        success: false,
        message: "Club not found",
      });
    }

    // Check if cname has changed, and if so, update the slug
    let newSlug = club.slug;
    if (cname && cname !== club.cname) {
      newSlug = slugify(cname, { lower: true });

      // Ensure slug is unique
      let slugExists = await Clubsmodal.findOne({ slug: newSlug });
      let count = 1;
      while (slugExists) {
        newSlug = slugify(`${cname}-${count}`, { lower: true });
        slugExists = await Clubsmodal.findOne({ slug: newSlug });
        count++;
      }
    }

    // Update the club with the new details
    const updatedClub = await Clubsmodal.findByIdAndUpdate(
      id,
      { name, cname, email, slug: newSlug },
      { new: true } // Return the updated document
    );

    res.status(200).send({
      success: true,
      message: "Club updated successfully",
      club: updatedClub,
    });
  } catch (error) {
    console.error("Error updating club:", error);
    res.status(500).send({
      success: false,
      message: "Error updating club",
      error,
    });
  }
};
// ===========================delete==

export const deleteClubController = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the club by ID and delete it
    const deletedClub = await Clubsmodal.findByIdAndDelete(id);

    if (!deletedClub) {
      return res.status(404).send({
        success: false,
        message: "Club not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Club deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting club:", error);
    res.status(500).send({
      success: false,
      message: "Error deleting club",
      error,
    });
  }
};

// =============login===========
export const logincontroller = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = await Clubsmodal.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Email is not registered",
      });
    }

    const match = await comparepassword(password, user.password);
    if (!match) {
      return res.status(201).send({
        success: false,
        message: "Invalid password",
      });
    }

    const token = await jsonwebtoken.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        slug: user.slug, // Include slug in the response
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// ============================================getclubname by slug============

export const getClubBySlugController = async (req, res) => {
  try {
    const { slug } = req.params;

    // Find the club by slug
    const club = await Clubsmodal.findOne({ slug });
    if (!club) {
      return res.status(404).send({
        success: false,
        message: "Club not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Club fetched successfully",
      club,
    });
  } catch (error) {
    console.error("Error fetching club:", error);
    res.status(500).send({
      success: false,
      message: "Error fetching club",
      error,
    });
  }
};

export const testcontroller = (req, res) => {
  res.send("protected");
};

import Pigeonwnermodal from "../models/Pigeonwnermodal.js";
import slugify from "slugify";
import crypto from "crypto";
import multer from "multer";
import path from "path";
import Tournament from "../models/tournamentModel.js";
import { log } from "console";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory for storing files
  },
  filename: (req, file, cb) => {
    const uniqueName = `${crypto.randomBytes(16).toString("hex")}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

export const getPigeonOwnersOfTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    const pigeonOwners = await Pigeonwnermodal.find({
      tournament: tournamentId.slice(1),
    }).sort({ _id: -1 });
    // console.log(pigeonOwners);

    res.status(200).json({
      success: true,
      msg: "Pigeon Data",
      pigeonOwners,
    });
  } catch (error) {
    console.error("Error: ", error.message);
    res
      .status(500)
      .json({ success: false, error: "Error", message: error.message });
  }
};

// Create employee with file upload
export const createOwner = async (req, res) => {
  try {
    const { name, contacts, city, tournament } = req.body;
    console.log(tournament);

    const isTournamentExist = await Tournament.findById(tournament);
    if (!isTournamentExist) {
      return res.status(400).json({
        success: false,
        msg: "tournament not found!",
      });
    }
    const owner = new Pigeonwnermodal({
      name,
      contacts,
      city,
      tournament: isTournamentExist._id,
      slug: `${name}-${Date.now()}`,
      image: req.file ? req.file.filename : null,
    });
    await owner.save();
    isTournamentExist.pigeonOwners.push(owner._id);
    // updating tournament
    await isTournamentExist.save();
    res.status(201).json({ success: true, data: owner });
  } catch (error) {
    console.error("Error creating Owner:", error);
    res
      .status(500)
      .json({ success: false, error: "Server Error", message: error.message });
  }
};
// Middleware for handling file uploads
export const uploadImage = upload.single("image");
//=========================================================================
//get data

export const getOwner = async (req, res) => {
  try {
    const owner = await Pigeonwnermodal.find({}, "name ");
    res.status(200).send({
      success: true,
      message: "Clubs fetched successfully",
      owner,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//==========================================================================
//get all data

export const getallowner = async (req, res) => {
  try {
    const owners = await Pigeonwnermodal.find();
    res.json(owners);
  } catch (error) {
    console.error("Error fetching owners:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//============================================================================
//update

export const updateOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOwner = await Pigeonwnermodal.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedOwner) {
      return res
        .status(404)
        .json({ success: false, message: "Owner not found" });
    }

    res.status(200).json({
      success: true,
      message: "Owner updated successfully",
      owner: updatedOwner,
    });
  } catch (error) {
    console.error("Error updating owner:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Delete Owner
export const deleteOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOwner = await Pigeonwnermodal.findByIdAndDelete(id);

    if (!deletedOwner) {
      return res
        .status(404)
        .json({ success: false, message: "Owner not found" });
    }

    res.status(200).json({
      success: true,
      message: "Owner deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting owner:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const createPegionResults = async (req, res) => {
  try {
    // pigeonsResults:
    const {
      pigeonOwnerId,
      totalPigeons,
      firstPigeonReturnTime,
      secondPigeonReturnTime,
      thirdPigeonReturnTime,
      fourthPigeonReturnTime,
      fifthPigeonReturnTime,
      sixthPigeonReturnTime,
      seventhPigeonReturnTime,
      total,
    } = req.body;
    const isPegionOwnerExists = await Pigeonwnermodal.findById(pigeonOwnerId);
    if (!isPegionOwnerExists) {
      res.status(400).json({
        status: false,
        msg: `pigeon owner not found with id ${pigeonOwnerId}`,
      });
    }
    const updatedPegionOwner = await Pigeonwnermodal.findByIdAndUpdate(
      pigeonOwnerId,
      {
        pigeonsResults: {
          totalPigeons,
          firstPigeonReturnTime,
          secondPigeonReturnTime,
          thirdPigeonReturnTime,
          fourthPigeonReturnTime,
          fifthPigeonReturnTime,
          sixthPigeonReturnTime,
          seventhPigeonReturnTime,
          total,
        },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      msg: "Pegions results Created!",
      updatedPegionOwner,
    });
  } catch (error) {
    console.error("Error ", error);
    res.status(400).json({ success: false, message: error });
  }
};

export const getTournamentOfPigeonOwners = async (req, res) => {
  try {
    const pigeonOwnerId = req.params.pigeonOwnerId.slice(1);
    const tournamentOfPigeonOwner = await Pigeonwnermodal.findOne({
      _id: pigeonOwnerId,
    }).populate("tournament", "startTime");

    if (tournamentOfPigeonOwner.populated() === "undefined") {
      return res.status(400).json({
        status: false,
        msg: `Tournament could not be populated`,
      });
    }
    if (!tournamentOfPigeonOwner) {
      return res.status(400).json({
        status: false,
        msg: `Tournament does not exists ${pigeonOwnerId}`,
      });
    }

    res.status(200).json({
      status: true,
      msg: "Tournament",
      startTime: tournamentOfPigeonOwner.tournament.startTime,
    });
  } catch (error) {
    console.error("Error ", error);
    return res.status(400).json({ success: false, message: error });
  }
};

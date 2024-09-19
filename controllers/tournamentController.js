import Tournament from "../models/tournamentModel.js";
import crypto from "crypto";
import multer from "multer";
import path from "path";
import Clubsmodal from "../models/Clubsmodal.js";
import { log } from "console";
// import Pigeonwnermodal from "../models/Pigeonwnermodal.js";

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

export const createTournament = async (req, res) => {
  try {
    const {
      owner_id,
      tournamentName,
      tournamentInformation,
      startDate,
      numberOfDays,
      startTime,
      numberOfPigeons,
      noteTimeForPigeons,
      helperPigeons,
      continueDays,
      status_,
      participatingLoft,
      numberOfPrizes,
      prizes,
      landedPigeons,
      dates,
    } = req.body;
    console.log(landedPigeons);

    if (!owner_id || !tournamentName || !startDate) {
      return res.status(400).json({
        success: false,
        message: "owner_id, tournamentName, startDate are required",
      });
    }
    const clubOwner = await Clubsmodal.findById({ _id: owner_id });
    if (!clubOwner) {
      return res.status(400).json({
        message: `Club owner not found with ${owner_id}`,
        error: error.message,
      });
    }
    const newTournament = await Tournament({
      image: req.file ? req.file.filename : null,
      tournamentName,
      tournamentInformation,
      landedPigeons,
      startDate,
      numberOfDays,
      startTime,
      numberOfPigeons,
      dates,
      noteTimeForPigeons,
      helperPigeons,
      continueDays,
      status_,
      participatingLoft,
      numberOfPrizes,
      prizes: Array.isArray(prizes) ? prizes : [],
    });
    newTournament.club_owner = clubOwner._id;
    newTournament.save();
    return res
      .status(201)
      .json({ success: true, newTournament, message: "tournament is created" });
  } catch (error) {
    return res.status(400).json({
      message: "Error",
      error: error.message,
    });
  }
};

export const getAllTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find({}).sort({ _id: -1 });
    return res.status(200).json({
      success: false,
      message: "Tournaments",
      tournaments,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error",
      error: error.message,
    });
  }
};

export const getTournament = async (req, res) => {
  try {
    const tournamentId = req.params.tournamentId.slice(1);
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: `tournament not found with ${tournamentId}`,
      });
    }
    return res.status(200).json({
      success: true,
      message: "tournament",
      tournament,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error",
      error: error.message,
    });
  }
};
export const deleteTournament = async (req, res) => {
  try {
    const tournamentId = req.params.tournamentId.slice(1);
    const deleted_tournament = await Tournament.findByIdAndDelete(tournamentId);
    if (!deleted_tournament) {
      return res.status(404).json({
        success: false,
        message: `tournament not found with ${tournamentId}`,
      });
    }
    return res.status(200).json({
      success: true,
      message: "tournament",
      deleted_tournament,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error",
      error: error.message,
    });
  }
};

export const updateTournament = async (req, res) => {
  try {
    const tournamentId = req.params.tournamentId.slice(1);
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: `tournament not found with ${tournamentId}`,
      });
    }
    console.log(req.body);
    const updated_tournament = await Tournament.findByIdAndUpdate(
      tournamentId,
      req.body,
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "tournament updated",
      updated_tournament,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error",
      error: error.message,
    });
  }
};

export const getTournamentsOfClub = async (req, res) => {
  try {
    const { club_id } = req.params;

    const clubTournaments = await Tournament.find({
      club_owner: club_id.slice(1),
    }).sort({ _id: -1 });
    res.status(200).json({
      success: true,
      msg: "Tournaments",
      clubTournaments,
    });
  } catch (error) {
    console.error("Error: ", error.message);
    res
      .status(500)
      .json({ success: false, error: "Error", message: error.message });
  }
};

export const getAllTournamentsWithPigeonOwners = async (req, res) => {
  try {
    const tournaments = await Tournament.find({})
      .populate("pigeonOwners")
      .sort({ _id: -1 });
    return res.status(200).json({
      success: true,
      message: "Tournaments",
      tournaments,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Error",
      error: error.message,
    });
  }
};

export const getTournamentsOfClubWithPigeonOwners = async (req, res) => {
  try {
    const { club_id } = req.params;
    console.log(club_id);
    const clubTournamentsPigeonOwners = await Tournament.find({
      club_owner: club_id.slice(1),
    })
      .populate("pigeonOwners")
      .sort({ _id: -1 });
    res.status(200).json({
      success: true,
      msg: "Tournaments",
      clubTournamentsPigeonOwners,
    });
  } catch (error) {
    console.error("Error: ", error.message);
    res
      .status(500)
      .json({ success: false, error: "Error", message: error.message });
  }
};

export const uploadImage = upload.single("image");

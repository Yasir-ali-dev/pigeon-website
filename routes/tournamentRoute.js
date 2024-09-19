import express from "express";
import {
  createTournament,
  deleteTournament,
  getAllTournaments,
  getTournament,
  updateTournament,
  getTournamentsOfClub,
  uploadImage,
  getAllTournamentsWithPigeonOwners,
  getTournamentsOfClubWithPigeonOwners,
} from "../controllers/tournamentController.js";
import { isadmin, requiresingnin } from "../middlewares/Authmiddleware.js";
// import { requiresingnin } from "../middlewares/Authmiddleware.js";

const router = express.Router();
router.route("/club/:club_id").get(getTournamentsOfClub);
router.route("/").get(getAllTournaments);

router.route("/").post(uploadImage, requiresingnin, createTournament);

router
  .route("/tournamentsWithPigeonOwners")
  .get(getAllTournamentsWithPigeonOwners);

router
  .route("/clubTournamentsWithPigeonOwners/:club_id")
  .get(getTournamentsOfClubWithPigeonOwners);

router
  .route("/:tournamentId")
  .get(getTournament)
  .delete(requiresingnin, isadmin, deleteTournament)
  .patch(updateTournament);
export default router;

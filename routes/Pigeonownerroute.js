// routes/employeeRoutes.js
import express from "express";
import {
  createOwner,
  deleteOwner,
  getallowner,
  getOwner,
  updateOwner,
  uploadImage,
  createPegionResults,
  getPigeonOwnersOfTournament,
  getTournamentOfPigeonOwners,
} from "../controllers/Pigeonownercontroller.js";
import { requiresingnin } from "../middlewares/Authmiddleware.js";

const router = express.Router();

router.post("/owner", requiresingnin, uploadImage, createOwner);

router.get("/owners", getOwner);

router.get("/pigeonOwners/:tournamentId", getPigeonOwnersOfTournament);

router.get(
  "/pigeonOwners/getPigeonOwnerTournament/:pigeonOwnerId",
  getTournamentOfPigeonOwners
);

// get pegion results
router.get("/allowners", getallowner);

// Update Owner Route
router.put("/owners/:id", requiresingnin, updateOwner);

// Delete Owner Route
router.delete("/owners/:id", requiresingnin, deleteOwner);

// router.put('/employees/:id',updateEmployee);
// router.delete('/employees/:id',deleteEmployee);
router.route("/createResults").patch(requiresingnin, createPegionResults);

export default router;

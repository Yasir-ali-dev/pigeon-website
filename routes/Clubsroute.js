import express from "express";
import { isadmin, requiresingnin } from "../middlewares/Authmiddleware.js";
import {
  deleteClubController,
  getAllClubsController,
  getClubBySlugController,
  logincontroller,
  registercontroller,
  testcontroller,
  updateClubController,
} from "../controllers/Clubscontroller.js";

const router = express.Router();

router.post("/register", requiresingnin, isadmin, registercontroller);
router.get("/clubs", getAllClubsController);
router
  .route("/clubs/:id")
  .put(requiresingnin, isadmin, updateClubController)
  .delete(requiresingnin, isadmin, deleteClubController);

router.post("/login", logincontroller);
router.get("/clubs/:slug", getClubBySlugController);

router.get("/test", requiresingnin, testcontroller);
router.get("/user-auth", requiresingnin, (req, res) => {
  res.status(201).send({ ok: true });
});

export default router;

import { express } from "express";
import { requestTournamentCreation } from "./../controllers/RequestTournamentController";
const router = express.Router();

router.route("/").post(requestTournamentCreation);
export default router;

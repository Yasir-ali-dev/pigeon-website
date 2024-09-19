import mongoose from "mongoose";
const requestTournamentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
    startDate: {
      type: Date,
    },
    tournamentName: {
      type: String,
      required: [true, "tournament name is required"],
    },
    image: {
      type: String,
    },
  },
  { timestamps }
);

const RequestTournament = mongoose.model(
  "RequestTournament",
  requestTournamentSchema
);
export default RequestTournament;

import mongoose from "mongoose";

const tournamentSchema = mongoose.Schema(
  {
    club_owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "club owner is required"],
      ref: "users",
    },
    status: {
      status: {
        type: String,
        enum: ["pending", "approved"],
        default: "pending",
      },
    },
    image: {
      type: String,
    },
    tournamentName: {
      type: String,
      required: true,
    },
    landedPigeons: {
      type: Number,
    },
    tournamentInformation: {
      type: String,
    },
    startDate: {
      type: Date,
      required: [true, "startdate is required"],
    },
    numberOfDays: {
      type: Number,
      // required: [true, "numberOfDays is required"],
    },
    startTime: {
      type: String,
      // required: [true, "startTime is required"],
    },
    numberOfPigeons: {
      type: Number,
      // required: [true, "numberOfPigeons ia required"],
    },
    noteTimeForPigeons: {
      type: String,
    },
    helperPigeons: {
      type: Number,
    },
    continueDays: {
      type: Number,
    },
    prizes: [{ type: Number }],

    status_: {
      type: String,
      enum: ["active", "in active"],
      default: "active",
    },
    numberOfPrizes: {
      type: Number,
    },
    pigeonOwners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "owner",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Middleware to handle removal from the Tournament when an owner is deleted
tournamentSchema.post("findOneAndDelete", async function (doc, next) {
  try {
    // `this` is the owner being removed

    const result = await mongoose
      .model("owner")
      .deleteMany({ tournament: doc._id });
    console.log(`${result.deletedCount} pigeon owner deleted with tournament!`);
    console.log(result);

    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("Tournament", tournamentSchema);

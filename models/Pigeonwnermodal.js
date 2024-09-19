import mongoose from "mongoose";
const employeeSchema = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: [true, "tournament is required"],
    },
    name: { type: String, required: true },
    contacts: { type: String, required: true },
    city: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    image: { type: String },
    pigeonsResults: {
      totalPigeons: {
        type: Number,
      },
      firstPigeonReturnTime: {
        type: String,
      },
      secondPigeonReturnTime: {
        type: String,
      },
      thirdPigeonReturnTime: {
        type: String,
      },
      fourthPigeonReturnTime: {
        type: String,
      },
      fifthPigeonReturnTime: {
        type: String,
      },
      sixthPigeonReturnTime: {
        type: String,
      },
      seventhPigeonReturnTime: {
        type: String,
      },
      total: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

// Middleware to handle removal from the Tournament when an owner is deleted
employeeSchema.post("findOneAndDelete", async function (doc, next) {
  try {
    // `this` is the owner being removed

    const result = await mongoose.model("Tournament").updateOne(
      { _id: doc.tournament },
      { $pull: { pigeonOwners: doc._id } } // Assuming the `owners` field is an array of owner references in the Tournament model
    );
    console.log(`${result.modifiedCount} pigeon owner pull from tournament!`);

    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("owner", employeeSchema);

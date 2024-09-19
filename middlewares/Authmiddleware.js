import jsonwebtoken from "jsonwebtoken";
import Clubsmodal from "../models/Clubsmodal.js";

export const requiresingnin = async (req, res, next) => {
  try {
    console.log("Headers:", req.headers); // Log all headers

    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    console.log("Token:", token); // Log the token
    console.log("JWT Secret:", process.env.JWT_SECRET); // Log the secret (temporarily for debugging)

    const decode = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};

export const isadmin = async (req, res, next) => {
  try {
    const user = await Clubsmodal.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "unauthrized access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
  }
};

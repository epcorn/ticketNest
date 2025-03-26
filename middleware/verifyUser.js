import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import User from "../models/userModel.js";

function createToken(user) {
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      rights: user.rights,
      active: user.active,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  return token;
}

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(errorHandler(401, "No token"));
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return next(errorHandler(401, "unauthorized"));
    }
    const dbUser = await User.findOne({ _id: user.id });

    if (!dbUser) {
      return next(errorHandler(404, "User not found"));
    }

    if (!dbUser.active) {
      return next(errorHandler(401, "User is inactive"));
    }

    req.user = user;
    next();
  });
};

const ifAdmin = (req, res, next) => {
  if (!req.user.rights.admin) {
    return next(errorHandler(403, "Forbidden"));
  }
  next();
};

const ifCreate = (req, res, next) => {
  if (!req.user.rights.create) {
    return next(errorHandler(403, "Foridden"));
  }
  next();
};

const ifAssign = (req, res, next) => {
  if (!req.user.rights.assign) {
    return next(errorHandler(403, "Forbidden"));
  }
  next();
};

const ifMarkDone = (req, res, next) => {
  if (!req.user.rights.markDone) {
    return next(errorHandler(403, "Forbidden"));
  }
};

export { createToken, verifyToken, ifAdmin, ifCreate, ifAssign, ifMarkDone };

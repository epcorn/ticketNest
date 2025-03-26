import { createToken } from "../middleware/verifyUser.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/userModel.js";

const login = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password || username === "" || password === "") {
    return next(errorHandler(400, "All fields are requird"));
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return next(errorHandler(404, "user not found!"));
    }
    const validUser = await user.comparePassword(password);
    if (!validUser) {
      return next(errorHandler(400, "Invalid credential"));
    }
    if (!user.active) {
      return next(errorHandler(403, "You are FORBIDDEN"));
    }
    const token = createToken(user);
    const { password: pass, ...data } = user._doc;

    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json({ message: `Hello ${user.username}`, result: data });
  } catch (error) {
    next(error);
  }
};
const logout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User have been signed out");
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { username: uname, password: pass, rights, _id, active } = req.body;
    if (_id) {
      const oldUser = await User.findById(_id);
      if (!oldUser) {
        return res.status(404).json({ message: "No such User!" });
      }

      if (uname) oldUser.username = uname;
      if (pass && pass !== "" && pass !== " ") {
        oldUser.password = pass;
      }
      if (rights) oldUser.rights = rights;
      if (typeof active !== "undefined") {
        oldUser.active = active;
      }
      await oldUser.save();
      const { password, ...rest } = oldUser._doc;

      return res.status(200).json({ message: "User updated!", result: rest });
    }

    if (!_id) {
      const existingUser = await User.findOne({ username: uname });
      if (existingUser) {
        return res.status(409).json({ message: "Oops! Username taken!" });
      }

      const newUser = await User.create({
        username: uname,
        password: pass,
        rights,
      });
      const { password, ...rest } = newUser._doc;

      return res.status(201).json({ message: "User created!", result: rest });
    }
  } catch (error) {
    next(error);
  }
};

const users = async (req, res, next) => {
  try {
    const users = await User.find({}).lean();
    const arrays = users.map(({ password, ...rest }) => rest);
    res.status(200).json({ result: arrays });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.status(403).json({
      message: `🌟 Enchanted Warning! 🌟
                 Deleting a User would break the magical bonds of
                 our data realm, scattering vital information into
                 the void. Guard the User's existence to keep our 
                 enchanted system in balance!`,
    });
    return;
    const deleted = await User.deleteOne({ _id: id });
    res.status(200).json({ message: "User Deleted", result: id });
  } catch (error) {
    next(error);
  }
};

export { login, logout, register, users, deleteUser };

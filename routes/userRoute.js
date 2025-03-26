import { Router } from "express";

import {
  login,
  logout,
  register,
  users,
  deleteUser,
} from "../controller/userController.js";
import { ifAdmin, verifyToken } from "../middleware/verifyUser.js";

const router = Router();

router.post("/login", login);
router.post("/register", verifyToken, ifAdmin, register);
router.post("/logout", logout);
router.get("/", verifyToken, ifAdmin, users);
router.delete("/:id", verifyToken, ifAdmin, deleteUser);
export default router;

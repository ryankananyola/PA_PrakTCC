import express from "express";
import {
  getUsers,
  getUserById,
  registerUser,
  updateUser,
  deleteUser,
  loginUser,
} from "../controller/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { refreshToken, logout } from "../controller/tokenController.js";

const router = express.Router();

// Auth routes
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/token", refreshToken);
router.delete("/logout", logout);

// User management (require token)
router.get("/", verifyToken, getUsers);
router.get("/:id", verifyToken, getUserById);
router.post("/", verifyToken, registerUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);


export default router;

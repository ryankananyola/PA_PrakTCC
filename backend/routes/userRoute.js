import express from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    registerUser,
    loginUser,
} from "../controller/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { generateAccessToken } from "../controller/tokenController.js";

const router = express.Router();

router.get("/token", generateAccessToken);

router.get("/users/", verifyToken, getUsers);
router.get("/users/:id", verifyToken, getUserById);
router.post("/add-users", createUser);
router.post("/users/login", loginUser);
router.put("/user/:id", verifyToken, updateUser);
router.delete("/user/:id", verifyToken, deleteUser);
router.post("/users/register", registerUser);

export default router;
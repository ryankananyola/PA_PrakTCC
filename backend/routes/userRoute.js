import express from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    registerUser,
    loginUser,
    verifyToken
} from "../controller/userController.js";



const router = express.Router();

router.get("/users/", getUsers);
router.get("/users/:id", getUserById);
router.post("/add-users", createUser);
router.post("/users/login", loginUser);
router.get("/users/verify", verifyToken);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);
router.post("/users/register", registerUser);

export default router;
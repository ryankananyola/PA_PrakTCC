import express from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from "../controller/userController.js";

const router = express.Router();

router.get("/users/", getUsers);
router.get("/users/:id", getUserById);
router.post("/add-users", createUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

export default router;
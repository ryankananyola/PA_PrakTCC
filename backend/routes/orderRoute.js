// routes/orderRoute.js
import express from "express";
import { 
    getOrders, 
    getOrderById, 
    createOrder, 
    updateOrder, 
    deleteOrder 
} from "../controller/orderController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Ganti endpoint ini untuk konsistensi
router.get("/", verifyToken, getOrders);
router.get("/:id", verifyToken, getOrderById);
router.post("/", verifyToken, createOrder);
router.put("/:id", verifyToken, updateOrder);
router.delete("/:id", verifyToken, deleteOrder);


export default router;
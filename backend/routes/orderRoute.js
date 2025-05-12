// routes/orderRoute.js
import express from "express";
import { 
    getOrders, 
    getOrderById, 
    createOrder, 
    updateOrder, 
    deleteOrder 
} from "../controller/orderController.js";

const router = express.Router();

// Ganti endpoint ini untuk konsistensi
router.get("/orders", getOrders);
router.get("/orders/:id", getOrderById);
router.post("/orders", createOrder);
router.put("/orders/:id", updateOrder);
router.delete("/orders/:id", deleteOrder);

export default router;